import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulCronService } from './contentful-cron.service';
import { ContentfulService } from '../contentful/contentful.service';
import { Logger } from '@nestjs/common';

describe('ContentfulCronService', () => {
  let service: ContentfulCronService;

  const mockContentfulService = {
    fetchContentfulData: jest.fn().mockResolvedValue([{ id: '1', title: 'Test' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentfulCronService,
        { provide: ContentfulService, useValue: mockContentfulService },
        Logger,
      ],
    }).compile();

    service = module.get<ContentfulCronService>(ContentfulCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch content from Contentful and log success', async () => {
    const logSpy = jest.spyOn(service['logger'], 'log');

    await service.handleCron();

    expect(mockContentfulService.fetchContentfulData).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Successfully fetched 1 items from Contentful.');
  });

  it('should log an error if fetching fails', async () => {
    mockContentfulService.fetchContentfulData.mockRejectedValue(new Error('API failed'));
    const errorSpy = jest.spyOn(service['logger'], 'error');

    await service.handleCron();

    expect(errorSpy).toHaveBeenCalledWith('Failed to fetch data from Contentful:', expect.any(Error));
  });
});

