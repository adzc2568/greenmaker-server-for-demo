import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WeatherDocument } from 'common/models/weather.model';
import { cloneDeep } from 'lodash';
import {
  WeatherQueryDto,
  CreateWeatherDto,
  UpdateWeatherDto,
} from './dto/weather.dto';
import axios from 'axios';
import * as dayjs from 'dayjs';
import { parse } from 'node-html-parser';
import { Cron } from '@nestjs/schedule';
import { MongoQueryModel } from 'nest-mongo-query-parser';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel('Weather', 'mrgreen')
    private readonly WeatherModel: Model<WeatherDocument>,
  ) {
    this.fetchWeather('2023-08-10')
    this.fetchWeather('2023-08-11')
    this.fetchWeather('2023-08-12')
    this.fetchWeather('2023-08-13')
    this.fetchWeather('2023-08-19')
    this.fetchWeather('2023-08-20')

  }

  public async getList(query: MongoQueryModel) {
    try {
      const find = this.WeatherModel.find(query.filter);
      const count = cloneDeep(find);

      find
        .select(query.select)
        .sort(query.sort)
        .skip(query.skip)
        .limit(query.limit)

      const [Items, Count] = await Promise.all([
        find.exec().then((documents) =>
          documents.map((document) => {
            const item = document.toJSON();
            item.Date = dayjs(item.Date).format();
            return item;
          }),
        ),
        count.countDocuments(),
      ]);

      return {
        data: {
          Items,
          Count,
        },
      };
    } catch (error) {
      return { error };
    }
  }

  public async getItem(_id: string) {
    try {
      const objectId = new Types.ObjectId(_id);
      const find = this.WeatherModel.findById(objectId);
      const data = await find.exec().then((document) => document.toJSON());
      return { data };
    } catch (error) {
      return { error };
    }
  }

  public async createItem(body: CreateWeatherDto) {
    try {
      const document = await this.WeatherModel.create(body);
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async updateItem(body: UpdateWeatherDto) {
    try {
      const objectId = new Types.ObjectId(body._id);
      const document = await this.WeatherModel.updateOne(
        { _id: objectId },
        { $set: body },
      );
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  public async deleteItem(_id: string) {
    try {
      const objectId = new Types.ObjectId(_id);
      const document = await this.WeatherModel.deleteOne({ _id: objectId });
      return { data: document };
    } catch (error) {
      return { error };
    }
  }

  @Cron('0 0 13 * * *')
  async fetchWeather(date) {
    try {
      const preDate = date ? dayjs(date) : dayjs().subtract(1, 'day');
      const { data } = await axios.get(
        `https://e-service.cwb.gov.tw/HistoryDataQuery/DayDataController.do?command=viewMain&station=C0C490&stname=%25E5%2585%25AB%25E5%25BE%25B7&datepicker=${preDate.format(
          'YYYY-MM-DD',
        )}&altitude=157m`,
      );

      const htmlDocument = parse(data);
      const weatherDatas = [];
      htmlDocument
        .querySelectorAll('#MyTable > tbody > tr')
        .forEach((tr, index) => {
          if (index < 3) return;
          const tds = tr.querySelectorAll('td');
          const weatherData = {
            ObsTime: Number(tds[0].text) || 0,
            Temperature: Number(tds[3].text) || 0,
            RH: Number(tds[5].text) || 0,
            WS: Number(tds[6].text) || 0,
            Precp: Number(tds[10].text) || 0,
            PrecpHour: Number(tds[11].text) || 0,
            SunShine: Number(tds[12].text) || 0,
            GloblRad: Number(tds[13].text) || 0,
          };

          weatherDatas.push(weatherData);
        });

      const body = {
        Date: preDate.format('YYYY-MM-DD'),
        WeatherDatas: weatherDatas,
      };

      const document = await this.WeatherModel.updateOne(
        { Date: body.Date },
        { $set: body },
        { upsert: true },
      );
      return { data: document };
    } catch (error) {
      return { error };
    }
  }
}
