import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CommentModel } from './model/comments.model';
import { CommentsService } from './comments.service';
import { CommentCreateInput, CommentUpdateInput } from './dto/comments.dto';
import { Comment } from '@prisma/client';

@Resolver(() => CommentModel)
export class CommentsResolver {
  constructor(private commentService: CommentsService) {}

  @Query(() => CommentModel)
  async comment(@Args('id') id: string): Promise<CommentModel> {
    return this.commentService.getCommentById(id);
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
  async updateComment(@Args('input') input: CommentUpdateInput): Promise<Comment> {
    return this.commentService.updateComment(input);
  }
}
