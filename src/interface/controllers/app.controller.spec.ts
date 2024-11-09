import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { HelloHandler } from '@application/queries/handlers/hello.handler';
import { AppService } from '@domain/services/app.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AppController],
      providers: [HelloHandler, AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    queryBus = app.get<QueryBus>(QueryBus);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const mockResponse = {
        status: jest.fn(),
      };
      jest.spyOn(queryBus, 'execute').mockResolvedValue({
        status: 200,
        result: { message: 'Hello World!' },
      });
      const result = await appController.getHello(mockResponse as any);
      expect(result.message).toBe('Hello World!');
    });
  });
});
