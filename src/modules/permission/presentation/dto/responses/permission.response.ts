import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PermissionResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: Partial<PermissionResponse>) {
    Object.assign(this, partial);
  }
}
