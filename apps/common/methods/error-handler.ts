import { HttpException, HttpStatus } from '@nestjs/common';
import { MongoServerError } from 'mongodb';

export function errorHandler(error): HttpException {
  console.log(error instanceof MongoServerError);
  switch (error.code) {
    case 11000:
    case 2616:
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    default:
      return new HttpException(
        error.message || error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }
}
