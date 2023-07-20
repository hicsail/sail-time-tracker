import { Test, TestingModule } from '@nestjs/testing';
import { ClickUpTaskResolver } from './click-up-task.resolver';

describe('ClickUpTaskResolver', () => {
  let resolver: ClickUpTaskResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClickUpTaskResolver]
    }).compile();

    resolver = module.get<ClickUpTaskResolver>(ClickUpTaskResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
