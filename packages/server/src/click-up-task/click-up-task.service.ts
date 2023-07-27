import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ClickUpStatuses, ClickUpTaskModel, ListCustomField } from './model/task.model';
import { ClickUpTaskCreateInput, ClickUpTaskInput, ClickUpTaskUpdateInput } from './dto/task.dto';

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

    const filteredCustomFields = data.fields.filter((field) => field.type !== 'formula' && field.name !== 'Award Amount' && field.name !== 'Responsible Personnel');
    const fiscalYear = filteredCustomFields.find((field) => field.name === 'FY: Work Completed');
    if (fiscalYear) {
      fiscalYear.type_config.options = fiscalYear.type_config.options.reverse();
    }
    return [...filteredCustomFields];
  }

  async getClickUpStatuses(): Promise<ClickUpStatuses[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.configService.get<string>('CLICKUP_URL')}/list/${this.configService.get<string>('CLICKUP_LIST_ID')}`, {
        headers: {
          Authorization: this.configService.get<string>('CLICKUP_TOKEN')
        }
      })
    );

    return data.statuses.reverse();
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

  async getClickUpTask(taskId: string): Promise<boolean | null> {
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

  async updateClickUpTask(task: ClickUpTaskUpdateInput): Promise<ClickUpTaskModel> {
    const { id, name, description, status, custom_fields } = task;
    try {
      const isFind = await this.getClickUpTask(id);
      if (isFind) {
        // update task
        const { data } = await firstValueFrom(
          this.httpService.put(
            `${this.configService.get<string>('CLICKUP_URL')}/task/${id}`,
            { name, description, status },
            {
              headers: {
                method: 'PUT',
                Authorization: this.configService.get<string>('CLICKUP_TOKEN')
              }
            }
          )
        );

        // update custom fields
        for (const custom_field of custom_fields) {
          await firstValueFrom(
            this.httpService.post(
              `https://api.clickup.com/api/v2/task/${id}/field/${custom_field.id}`,
              { value: custom_field.value },
              {
                headers: {
                  method: 'POST',
                  Authorization: this.configService.get<string>('CLICKUP_TOKEN')
                }
              }
            )
          );
        }
        return { url: data.url, id: data.id };
      } else {
        new Error('Task not found');
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
