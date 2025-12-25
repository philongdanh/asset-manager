import { UserStatus } from 'src/domain/identity/user';

export class GetUsersDto {
  departmentId?: string;
  status?: UserStatus;
  roleId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
}
