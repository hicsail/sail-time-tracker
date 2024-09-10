import { Injectable } from '@nestjs/common';
import { Burndown } from './model/burndown.model';
import { RecordService } from '../record/record.service';
import { ClickUpTaskService } from 'src/click-up-task/click-up-task.service';
import { ClickUpTaskCreateInput } from 'src/click-up-task/dto/task.dto';


interface DateRange {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class BurndownService {
  constructor(
    private readonly recordService: RecordService,
    private readonly taskService: ClickUpTaskService
  ) {}

  async getRealBurndown(): Promise<Burndown[]> {
    const task = await this.taskService.get('8686r8xnz');
    if (!task) {
      throw new Error(`Task not found for project`);
    }
    const projectStartDate = this.getStartDateFromTask(task);
    const projectEndDate = this.getEndDateFromTask(task);

    // Get the initial week range
    let startRange = new Date(projectStartDate.getTime());
    let endRange = new Date(startRange.getTime());
    endRange.setDate(startRange.getDate() + 7);
    if (endRange > projectEndDate) {
      // endRange = projectEndDate;
    }

    console.log(projectEndDate);

    // While we aren't at the end of the range, get the aggregate hours spent
    while (endRange <= projectEndDate) {
      console.log(`Start: ${startRange}, End: ${endRange}`);

      // Update the date range
      startRange = new Date(endRange.getTime());
      endRange.setDate(startRange.getDate() + 7);
    }


    // Loop from start up until no records are available
      // Aggregate the number of hours for a time period

      // Update the date range to search over


    return [];
  }

  private getStartDateFromTask(task: any): Date {
    return new Date(parseInt(task.start_date));
  }

  private getEndDateFromTask(task: any): Date {
    return new Date(parseInt(task.due_date));
  }
}
