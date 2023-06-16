import { Injectable } from '@nestjs/common';
import { CommentCreateInput } from './dto/comments.dto';
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
}
