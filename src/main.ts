import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger=new Logger('Bootstrap')
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
   );
   app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  }); 
  await app.listen(process.env.PORT);
  logger.log(`App running on port:${process.env.PORT}`)
}
bootstrap();
