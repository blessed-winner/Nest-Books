import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const error: any = exception;
    console.error('[DB ERROR]', error.code, error.message);
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        res
          .status(409)
          .json({ message: 'Duplicate entry. This value must be unique.' });
        break;

      case 'ER_NO_REFERENCED_ROW_2':
        res
          .status(400)
          .json({ message: 'Invalid reference. Related record not found.' });
        break;

      case 'ER_BAD_NULL_ERROR':
        res
          .status(400)
          .json({ message: 'Missing required field. Cannot be null.' });
        break;

      default:
        res
          .status(500)
          .json({ message: 'Internal server error', detail: error.message });
    }
  }
}
