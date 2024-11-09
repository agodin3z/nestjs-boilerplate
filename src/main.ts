import 'dotenv/config';

import { LogLevel, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

const logger = new Logger('Boilerplate API');
const getLogLevels = (prod: boolean): LogLevel[] => {
  if (prod) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
};

async function bootstrap() {
  const currEnv = process.env.NODE_ENV ?? 'development';
  const allowDocs = process.env.ENABLE_DOCUMENTATION === 'true';
  const port = process.env.PORT ?? 3000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: getLogLevels(currEnv === 'production'),
    // Uncomment to enable SSL
    /* ...(process.env.USE_SSL === 'true'
        ? {
            httpsOptions: {
              key: fs.readFileSync(process.env.SSL_KEY),
              cert: fs.readFileSync(process.env.SSL_CERT),
            },
          }
        : {}), */
  });

  app.useBodyParser('json', { limit: '10mb' });
  app.enableCors({ origin: true });
  app.use(
    helmet({
      contentSecurityPolicy: currEnv !== 'production' ? false : undefined,
    }),
  );
  // app.use(permissionsPolicy({ features: {} }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  if (allowDocs) {
    const options = new DocumentBuilder()
      .setTitle('BOILERPLATE API')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();
    const docs = SwaggerModule.createDocument(app, options, {});
    SwaggerModule.setup('/docs', app, docs);
  }

  app.enableShutdownHooks();
  await app.listen(port, '0.0.0.0', () => {
    logger.log(`🚀 ${currEnv} api ready at port ${port}`);
  });
}
bootstrap();
