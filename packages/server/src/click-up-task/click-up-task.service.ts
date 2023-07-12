import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ClickUpStatuses, ClickUpTaskModel, ListCustomField } from './model/task.model';
import { ClickUpTaskCreateInput, ClickUpTaskInput } from './dto/task.dto';

@Injectable()
export class ClickUpTaskService {
  constructor(private prisma: PrismaService, private readonly httpService: HttpService, private configService: ConfigService) {}

  async getClickUpCustomFields(): Promise<ListCustomField[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.configService.get<string>('CLICKUP_URL')}/list/${this.configService.get<string>('CLICKUP_LIST_ID')}/field`, {
        headers: {
          Authorization: this.configService.get<string>('CLICKUP_TOKEN')
        }
      })
    );

    return data.fields.filter(
      (field) => field.type !== 'formula' && field.name !== 'Award Amount' && field.name !== 'Responsible Personnel' && field.name !== 'Invoice Payment Status'
    );
  }

  async getClickUpStatuses(): Promise<ClickUpStatuses[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.configService.get<string>('CLICKUP_URL')}/list/${this.configService.get<string>('CLICKUP_LIST_ID')}`, {
        headers: {
          Authorization: this.configService.get<string>('CLICKUP_TOKEN')
        }
      })
    );

    return data.statuses;
  }

  async createClickUpTask(task: ClickUpTaskCreateInput): Promise<ClickUpTaskModel> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.configService.get<string>('CLICKUP_URL')}/list/${this.configService.get<string>('CLICKUP_LIST_ID')}/task`, task, {
          headers: {
            Authorization: this.configService.get<string>('CLICKUP_TOKEN')
          }
        })
      );
      return { url: data.url, id: data.id };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async getClickUpTask(taskId: string): Promise<boolean> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.configService.get<string>('CLICKUP_URL')}/task/${taskId}`, {
          headers: {
            Authorization: this.configService.get<string>('CLICKUP_TOKEN')
          }
        })
      );
      return !!data;
    } catch (error) {
      new Error('Task not found');
    }
  }

  async createAndAddClickUpTaskToInvoice(invoiceId: string, task: ClickUpTaskInput): Promise<ClickUpTaskModel> {
    return this.prisma.clickUpTask.create({
      data: {
        id: task.id,
        url: task.url,
        invoiceId: invoiceId
      }
    });
  }
}
