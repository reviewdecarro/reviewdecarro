import {
	BadRequestException,
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { BadRequestError } from '../types/bad-request-error';

@Injectable()
export class BadRequestInterceptor implements NestInterceptor {
	intercept(
		_context: ExecutionContext,
		next: CallHandler,
	): Observable<unknown> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof BadRequestError) {
					return throwError(() => new BadRequestException(error.message));
				}

				return throwError(() => error);
			}),
		);
	}
}
