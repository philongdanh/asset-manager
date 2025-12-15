export class Asset {
  public asset_id: number;
  public organization_id: number;
  public asset_name: string;
  public asset_code: string;
  // ... các thuộc tính khác

  constructor(
    asset_id: number,
    organization_id: number,
    asset_name: string,
    asset_code: string,
  ) {
    this.asset_id = asset_id;
    this.organization_id = organization_id;
    this.asset_name = asset_name;
    this.asset_code = asset_code;
  }

  // Quy tắc nghiệp vụ cấp cao: Tạo một Asset mới
  public static createNew(
    organizationId: number,
    name: string,
    code: string,
  ): Asset {
    // Thêm các kiểm tra nghiệp vụ TẠI ĐÂY (ví dụ: tên không được quá dài)
    if (!name || name.length < 5) {
      throw new Error('Asset name is too short.');
    }
    // ID = 0 hoặc null khi chưa được DB gán
    return new Asset(0, organizationId, name, code);
  }
}
