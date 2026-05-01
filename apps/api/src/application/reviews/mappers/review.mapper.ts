import { plainToInstance } from "class-transformer";
import { ReviewResponseDto } from "../dtos/create-review.dto";
import { ReviewEntity } from "../entities/review.entity";

export class ReviewsMapper {
	static toReviewResponseDto(review: ReviewEntity): ReviewResponseDto {
		return plainToInstance(ReviewResponseDto, review, {
			excludeExtraneousValues: true,
		});
	}
}
