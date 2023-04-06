import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteProjectService } from './favorite-project.service';

describe('FavoriteProjectService', () => {
  let service: FavoriteProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteProjectService]
    }).compile();

    service = module.get<FavoriteProjectService>(FavoriteProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
