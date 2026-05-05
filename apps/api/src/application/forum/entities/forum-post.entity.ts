import { Expose } from "class-transformer";

export class ForumPostEntity {
  @Expose() id: string;
  @Expose() topicId: string;
  @Expose() authorId: string;
  @Expose() parentPostId: string | null;
  @Expose() content: string;
  @Expose() status: string;
  @Expose() upvotes: number;
  @Expose() downvotes: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() deletedAt: Date | null;
  @Expose() author?: { id: string; username: string };

  constructor(partial: Partial<ForumPostEntity>) {
    Object.assign(this, partial);
  }
}
