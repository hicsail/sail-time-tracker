import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteProjectResolver } from './favorite-project.resolver';

describe('FavoriteProjectResolver', () => {
  let resolver: FavoriteProjectResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteProjectResolver]
    }).compile();

    resolver = module.get<FavoriteProjectResolver>(FavoriteProjectResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
