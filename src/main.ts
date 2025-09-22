import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Envs } from 'envs';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  //Configuración de swagger

  const config = new DocumentBuilder()
    .setTitle('API E-commerce')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .addBasicAuth() // PARA JWT
    .build()


  const document = SwaggerModule.createDocument(app, config)


  SwaggerModule.setup('api', app, document)


  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,             // elimina campos no definidos en el DTO
    forbidNonWhitelisted: true,  // lanza error si mandas un campo desconocido
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }         // convierte los tipos (string → number, etc.)
  }));

  await app.listen(Envs.PORT);
  Logger.log(`http://localhost:${Envs.PORT}`)
}
bootstrap();
