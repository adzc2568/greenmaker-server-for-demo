import {
  Controller,
  Post,
  Body,
  Redirect,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorator/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  @Redirect(`${process.env.CLIENT_HOST}/#/Redirect`)
  login(@Body() body) {
    return {
      url: `${process.env.CLIENT_HOST}/#/Redirect?credential=${body.credential}`,
    };
  }
}
