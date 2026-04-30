import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	NotFoundException,
} from "@nestjs/common";
import { catchError, Observable, throwError } from "rxjs";
import { NotFoundError } from "../types/not-found-error";

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
	intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof NotFoundError) {
					return throwError(() => new NotFoundException(error.message));
				}
				return throwError(() => error);
			}),
		);
	}
}
