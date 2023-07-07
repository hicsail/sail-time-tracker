import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ProjectModule } from './project/project.module';
import { FavoriteProjectModule } from './favorite-project/favorite-project.module';
import { RecordModule } from './record/record.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    EmployeesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        origin: ['http://localhost:5173', 'https://*.sail.codes'],
        preflightContinue: true,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 204
      }
    }),
    ProjectModule,
    FavoriteProjectModule,
    RecordModule,
    InvoiceModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
