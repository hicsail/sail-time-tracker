import { Injectable } from '@nestjs/common';
import { Burndown } from './model/burndown.model';
import { RecordService } from '../record/record.service';
import { ClickUpTaskService } from 'src/click-up-task/click-up-task.service';
import { PrismaService } from 'nestjs-prisma';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class BurndownService {
  constructor(
    private readonly taskService: ClickUpTaskService,
    private readonly prisma: PrismaService
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

    // Set the end range for a week out (end date aware)
    endRange.setDate(startRange.getDate() + 7);
    if (endRange > projectEndDate) {
      endRange = projectEndDate;
    }

    const results: Burndown[] = [];

    // While we aren't at the end of the range, get the aggregate hours spent
    while (endRange <= projectEndDate) {
      // Aggregate hours spent over the range
      const aggregate = await this.prisma.record.aggregate({
        _sum: {
          hours: true
        },
        where: {
          projectId: '62602e89-f409-475e-83c2-bf216e84ba04',
          date: {
            gte: startRange,
            lt: endRange
          }
        }
      });

      results.push({
        startDate: new Date(startRange.getTime()),
        endDate: new Date(endRange.getTime()),
        hours: aggregate._sum.hours || 0
      })

      // Update the date range
      startRange = new Date(endRange.getTime());
      endRange.setDate(startRange.getDate() + 7);
    }

    return results;
  }

  private getStartDateFromTask(task: any): Date {
    return new Date(parseInt(task.start_date));
  }

  private getEndDateFromTask(task: any): Date {
    return new Date(parseInt(task.due_date));
  }
}
