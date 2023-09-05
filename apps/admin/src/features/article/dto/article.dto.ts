import {
  IsOptional,
  IsString,
  IsArray,
  ValidateIf,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { QueryDto } from '../../../common/dto/query.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleQueryDto extends QueryDto {
  @ApiPropertyOptional({ description: '文章標題' })
  @IsOptional()
  @IsString()
  public Title?: string;
}

class Content {
  @ApiProperty({
    type: String,
    description: 'Vue Render Element Type',
  })
  @IsString()
  public type: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Html Element Attributes',
  })
  @IsOptional()
  @IsObject()
  public attrs?: object;

  @ApiPropertyOptional({
    type: String,
    description: 'Html Textnode Content',
  })
  @IsOptional()
  @IsString()
  public text?: string;

  @ApiProperty({
    type: [Content],
    description: 'Child Content',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Content)
  public content?: Content[];
}

export class ArticleDto {
  @ApiProperty({
    type: String,
    description:
      'Url Title - 在前端文章頁面，以此作為 Url Params 比 _id 更有可讀性，主要對 SEO 有所幫助',
  })
  @IsString()
  public UrlTitle: string;

  @ApiProperty({
    type: String,
    description: '文章標題',
  })
  @IsString()
  public Title: string;

  @ApiProperty({
    type: [String],
    description: '標籤',
  })
  @IsArray()
  @IsString({ each: true })
  public TagIds: string[];

  @ApiProperty({
    type: String,
    description: '文章類型',
  })
  @IsString()
  public TypeId: string;

  @ApiProperty({
    type: [Content],
    description: '文章內容 - 用於前端動態渲染',
  })
  @IsArray()
  @ValidateNested()
  @Type(() => Content)
  public Content: Content[];

  @ApiProperty({
    type: String,
    nullable: true,
    description: '文章摘要',
  })
  @IsString()
  @ValidateIf((value) => value === null)
  public Summary: string;
}

export class ArticleWithIdDto extends ArticleDto {
  @ApiProperty()
  @IsString()
  public _id: string;
}
