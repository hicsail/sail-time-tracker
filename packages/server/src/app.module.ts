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

@Module({
  imports: [
    EmployeesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: true
    }),
    ProjectModule,
    FavoriteProjectModule,
    RecordModule,
    InvoiceModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
