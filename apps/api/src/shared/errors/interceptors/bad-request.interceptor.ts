import {
	BadRequestException,
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { BadRequestError } from "../types/bad-request-error";

@Injectable()
export class BadRequestInterceptor implements NestInterceptor {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((error) => {
				if (error instanceof BadRequestError) {
					throw new BadRequestException(error.message);
				}
				throw error;
			}),
		);
	}
}
