import { plainToInstance } from "class-transformer";
import { ModelResponseDto } from "../dtos/create-model.dto";
import { CarModelEntity } from "../entities/car-model.entity";

export function toModelResponseDto(model: CarModelEntity): ModelResponseDto {
	return plainToInstance(ModelResponseDto, model, {
		excludeExtraneousValues: true,
	});
}
