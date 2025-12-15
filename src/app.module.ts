import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetModule } from './presentation/asset/asset.module';

@Module({
  imports: [AssetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
