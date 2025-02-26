import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, map } from 'rxjs';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        if (!data) {
          return;
        }
        if (Array.isArray(data)) {
          return data.map((item) => item?.toObject());
        }
        if (data.hasOwnProperty('toObject')) {
          return data?.toObject();
        }
        return data;
      }),
      catchError((err) => {
        console.log(err);
        throw new BadRequestException(err);
      }),
    );
  }
}
