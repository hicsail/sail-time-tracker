import { Test, TestingModule } from '@nestjs/testing';
import { BillableHoursResolver } from './billable-hours.resolver';

describe('BillableHoursResolver', () => {
  let resolver: BillableHoursResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillableHoursResolver]
    }).compile();

    resolver = module.get<BillableHoursResolver>(BillableHoursResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
