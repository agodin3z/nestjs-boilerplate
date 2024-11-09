import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { HelloHandler } from './application/queries/handlers/hello.handler';
import { AppService } from './domain/services/app.service';
import { configuration, validationSchema } from './infraestructure/config';
import { HealthModule } from './infraestructure/health/health.module';
import { AppController } from './interface/controllers/app.controller';
import { HttpExceptionFilter } from './interface/exceptions/http-exception.filter';
import { DomainFilterMiddleware } from './interface/middlewares/domain-filter.middleware';
import { HttpLogger } from './interface/middlewares/http-logger.middleware';

const providers = [AppService, { provide: APP_FILTER, useClass: HttpExceptionFilter }];
const controllers = [AppController];

const commands = [];
const events = [];
const queries = [HelloHandler];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: false,
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    HealthModule,
    CqrsModule,
  ],
  controllers: [...controllers],
  providers: [...providers, ...commands, ...events, ...queries],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLogger, DomainFilterMiddleware).forRoutes('*');
  }
}
