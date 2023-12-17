import { Test, TestingModule } from '@nestjs/testing';
import { BillableHoursService } from './billable-hours.service';

describe('BillableHoursService', () => {
  let service: BillableHoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillableHoursService]
    }).compile();

    service = module.get<BillableHoursService>(BillableHoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
