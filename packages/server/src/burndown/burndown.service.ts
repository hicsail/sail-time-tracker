import { Injectable } from '@nestjs/common';
import { Burndown } from './model/burndown.model';
import { RecordService } from '../record/record.service';
import { ClickUpTaskService } from 'src/click-up-task/click-up-task.service';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class BurndownService {
  private readonly clickupHourlyFieldID = this.configService.getOrThrow<string>('CLICKUP_HOURS_ID');

  constructor(
    private readonly taskService: ClickUpTaskService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async getRealBurndown(projectId: string): Promise<Burndown[]> {
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
          projectId,
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

  async getEstimateBurndown(projectId: string): Promise<Burndown[]> {
    // TODO: Get Project <-> ClickUP ID
    const task = await this.taskService.get('8686r8xnz');
    if (!task) {
      throw new Error(`Task not found for project`);
    }
    const projectStartDate = this.getStartDateFromTask(task);
    const projectEndDate = this.getEndDateFromTask(task);

    // Get the initial week range
    let startRange = new Date(projectStartDate.getTime());
    let endRange = new Date(startRange.getTime());

    // Get the FTE value from the task
    const weeklyEstimate = this.getHoursPerWeek(task);

    // Set the end range for a week out (end date aware)
    endRange.setDate(startRange.getDate() + 7);
    if (endRange > projectEndDate) {
      endRange = projectEndDate;
    }

    const results: Burndown[] = [];

    // While we aren't at the end of the range, get the aggregate hours spent
    while (endRange <= projectEndDate) {

      results.push({
        startDate: new Date(startRange.getTime()),
        endDate: new Date(endRange.getTime()),
        // Currently just setting the estimate based on FTE -> hours in week
        // in the future this function is intended for more complex functionality
        hours: weeklyEstimate
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

  private getHoursPerWeek(task: any): number {
    const target = task.custom_fields.find((field: any) => field.id == this.clickupHourlyFieldID);

    if (!target) {
      throw new Error(`Could not find hours field`);
    }

    return target.value;
  }
}
