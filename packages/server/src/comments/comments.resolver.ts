import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CommentModel } from './model/comments.model';
import { CommentsService } from './comments.service';
import { CommentCreateInput } from './dto/comments.dto';
import { Comment } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => CommentModel)
export class CommentsResolver {
  constructor(private commentService: CommentsService) {}

  @Query(() => CommentModel)
  async comment(@Args('id') id: string): Promise<CommentModel> {
    const comment = await this.commentService.getCommentById(id);

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  @Query(() => [CommentModel])
  async comments(): Promise<CommentModel[]> {
    return this.commentService.getComments();
  }

  @Mutation(() => CommentModel)
  async addComment(@Args('input') input: CommentCreateInput): Promise<Comment> {
    return this.commentService.addComment(input);
  }

  @Mutation(() => CommentModel)
  async deleteComment(@Args('id') id: string): Promise<Comment> {
    return this.commentService.deleteComment(id);
  }
}
