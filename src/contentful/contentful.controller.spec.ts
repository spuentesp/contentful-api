  import { Test, TestingModule } from '@nestjs/testing';
  import { ContentfulController } from './contentful.controller';
  import { ContentfulCronService } from '../contentful-cron/contentful-cron.service';
  import { ContentfulService } from '../contentful/contentful.service';
  describe('ContentfulController', () => {
    let controller: ContentfulController;
  
    const mockContentfulService = {
      fetchContentfulData: jest.fn().mockResolvedValue([{ id: '1', title: 'Test' }]),
    };
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ContentfulController],
        providers: [
          ContentfulCronService,
          { provide: ContentfulService, useValue: mockContentfulService }, 
        ],
      }).compile();
  
      controller = module.get<ContentfulController>(ContentfulController);
    });
  
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });