import { Module } from '@nestjs/common';
import { FileController } from './presentation/controllers/file.controller';
import { FileService } from './application/services/file.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
