import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { RoleEntity } from "../entities/role.entity";
import { RolesRepositoryProps } from "../repositories/roles.repository";
import { FindRolesUseCase } from "./find-roles.usecase";

const mockRolesRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByName: jest.fn(),
  assign: jest.fn(),
} as unknown as jest.Mocked<RolesRepositoryProps>;

describe("FindRolesUseCase", () => {
  let sut: FindRolesUseCase;

  beforeEach(() => {
    sut = new FindRolesUseCase(mockRolesRepository);
    jest.clearAllMocks();
  });

  it("should return a list of RoleResponseDtos", async () => {
    mockRolesRepository.findAll.mockResolvedValue([
      new RoleEntity({ id: "r-1", name: "admin", createdAt: new Date(), updatedAt: new Date() }),
      new RoleEntity({ id: "r-2", name: "user", createdAt: new Date(), updatedAt: new Date() }),
    ]);

    const result = await sut.execute();

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("name", "admin");
    expect(result[1]).toHaveProperty("name", "user");
  });

  it("should return empty array when no roles exist", async () => {
    mockRolesRepository.findAll.mockResolvedValue([]);

    const result = await sut.execute();

    expect(result).toEqual([]);
  });
});
