import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetModule } from './presentation/asset/asset.module';
import { ConfigModule } from '@nestjs/config';
import { OrganizationModule } from './presentation/organization/organization.module';

@Module({
  imports: [
    //
    ConfigModule.forRoot(),
    AssetModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
