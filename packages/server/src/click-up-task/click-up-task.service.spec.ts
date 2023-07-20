import { Test, TestingModule } from '@nestjs/testing';
import { ClickUpTaskService } from './click-up-task.service';

describe('ClickUpTaskService', () => {
  let service: ClickUpTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClickUpTaskService]
    }).compile();

    service = module.get<ClickUpTaskService>(ClickUpTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
