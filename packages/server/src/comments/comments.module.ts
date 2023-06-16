import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { PrismaModule } from 'nestjs-prisma';
@Module({
  imports: [PrismaModule.forRoot()],
  providers: [CommentsService, CommentsResolver]
})
export class CommentsModule {}
