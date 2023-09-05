import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class AppService {
  @Cron('0 0/10 * * * *')
  private async doNotSleep() {
    try {
      const { data } = await axios.get(
        'https://greenmaker-admin-server.onrender.com/api/do-not-sleep',
      );
      console.log(data);
    } catch (error) {
      throw error;
    }
  }
}
