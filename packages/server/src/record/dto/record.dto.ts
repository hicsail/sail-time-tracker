import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsDate, IsNumber } from 'class-validator';
import { EmployeeUpdateInput } from '../../employees/dto/employee.dto';
import { ProjectUpdateInput } from '../../project/dto/project.dto';

@InputType()
export class RecordCreateInput {
  @Field()
  @IsNotEmpty()
  employee: EmployeeUpdateInput;

  @Field()
  @IsNotEmpty()
  project: ProjectUpdateInput;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  hours: number;

  @Field()
  @IsDate()
  @IsNotEmpty()
  date: Date;
}
