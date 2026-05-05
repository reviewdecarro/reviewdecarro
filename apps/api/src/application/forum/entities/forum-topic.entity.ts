import { Expose } from "class-transformer";

export class ForumTopicEntity {
  @Expose() id: string;
  @Expose() authorId: string;
  @Expose() title: string;
  @Expose() slug: string;
  @Expose() content: string;
  @Expose() status: string;
  @Expose() viewsCount: number;
  @Expose() postsCount: number;
  @Expose() upvotes: number;
  @Expose() downvotes: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() deletedAt: Date | null;
  @Expose() author?: { id: string; username: string };

  constructor(partial: Partial<ForumTopicEntity>) {
    Object.assign(this, partial);
  }
}
