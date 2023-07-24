import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { RepositoryService } from './repository/storage.repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RepositoryService],
})
export class AppModule {}
