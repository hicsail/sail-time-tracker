import { Injectable } from '@nestjs/common';
import { CommentCreateInput, CommentUpdateInput } from './dto/comments.dto';
import { Comment } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getComments(): Promise<Comment[]> {
    return this.prisma.comment.findMany();
  }

  async getCommentById(id: string): Promise<Comment> {
    return this.prisma.comment.findUnique({
      where: {
        commentId: id
      }
    });
  }

  async addComment(comment: CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({
      data: comment
    });
  }

  async updateComment(comment: CommentUpdateInput): Promise<Comment> {
    return this.prisma.comment.update({
      where: {
        commentId: comment.commentId
      },
      data: {
        modifiedDate: new Date(),
        content: comment.content
      }
    });
  }
}
