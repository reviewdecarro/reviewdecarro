import { Expose } from "class-transformer";

export class ForumVoteEntity {
  @Expose() id: string;
  @Expose() userId: string;
  @Expose() targetId: string;
  @Expose() targetType: string;
  @Expose() value: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  constructor(partial: Partial<ForumVoteEntity>) {
    Object.assign(this, partial);
  }
}
