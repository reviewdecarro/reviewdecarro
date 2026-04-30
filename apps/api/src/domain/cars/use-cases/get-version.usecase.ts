import { Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../shared/errors/types/not-found-error";
import { CarVersionEntity } from "../entities/car-version.entity";
import { toVersionResponseDto } from "../mappers/version.mapper";
import { VersionsRepositoryProps } from "../repositories/versions.repository";

@Injectable()
export class GetVersionUseCase {
  constructor(private versionsRepository: VersionsRepositoryProps) {}

  async execute(slug: string) {
    const version = await this.versionsRepository.findBySlug(slug);

    if (!version) {
      throw new NotFoundError("Car version not found");
    }

    return toVersionResponseDto(new CarVersionEntity(version));
  }
}
