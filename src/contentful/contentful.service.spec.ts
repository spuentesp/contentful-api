import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulService } from './contentful.service';
import { ConfigService } from '@nestjs/config';

describe('ContentfulService', () => {
  let service: ContentfulService;

  const mockConfigService = {
    get: jest.fn((key) => {
      const env = {
        CONTENTFUL_SPACE_ID: 'test_space',
        CONTENTFUL_ACCESS_TOKEN: 'test_token',
      };
      return env[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ContentfulService>(ContentfulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch contentful data', async () => {
    jest.spyOn(service, 'fetchContentfulData').mockResolvedValue([{ id: '1' }]);

    const result = await service.fetchContentfulData();
    expect(result).toEqual([{ id: '1' }]);
  });
});
