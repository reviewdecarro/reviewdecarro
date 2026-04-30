import { plainToInstance } from "class-transformer";
import { ModelResponseDto, ModelWithVersionsResponseDto } from "../dtos/create-model.dto";
import { CarModelEntity } from "../entities/car-model.entity";

export function toModelResponseDto(model: CarModelEntity): ModelResponseDto {
	return plainToInstance(ModelResponseDto, model, {
		excludeExtraneousValues: true,
	});
}

export function toModelWithVersionsResponseDto(model: CarModelEntity): ModelWithVersionsResponseDto {
	return plainToInstance(ModelWithVersionsResponseDto, model, {
		excludeExtraneousValues: true,
	});
}
