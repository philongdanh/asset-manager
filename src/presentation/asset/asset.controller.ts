// src/presentation/asset/asset.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateAssetUseCase } from 'src/application/asset/create-asset.use-case';
import { CreateAssetDto } from './dto/create-asset.dto';

@Controller('assets')
export class AssetController {
  constructor(private readonly createAssetUseCase: CreateAssetUseCase) {}

  @Post()
  // @UseGuards(AuthGuard) // Giả sử có Guard kiểm tra đăng nhập/quyền
  async create(@Body() dto: CreateAssetDto) {
    // Lấy organization_id từ token người dùng (req.user.organizationId)
    const organizationId = 1; // Giá trị giả lập

    // Controller chỉ truyền dữ liệu, không xử lý nghiệp vụ
    const result = await this.createAssetUseCase.execute({
      organizationId,
      assetName: dto.asset_name,
      assetCode: dto.asset_code,
    });

    return {
      id: result.asset_id,
      name: result.asset_name,
      code: result.asset_code,
    }; // Trả về DTO/View Model gọn gàng
  }
}
