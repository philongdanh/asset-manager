import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserCommand } from 'src/application/commands/create-user.command';
import { CreateUserHandler } from 'src/application/commands/handlers';
import {
  GetUserDetailsHandler,
  GetUsersHandler,
} from 'src/application/queries/handlers';
import { Public } from '../auth/decorators';
import {
  CreateUserRequest,
  GetUserDetailsResponse,
  GetUsersRequest,
} from './dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserHandler: CreateUserHandler,
    private readonly getUsersHandler: GetUsersHandler,
    private readonly getUserDetailsHandler: GetUserDetailsHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateUserRequest) {
    const cmd = new CreateUserCommand(
      dto.organizationId,
      dto.username,
      dto.password,
      dto.email,
      dto.departmentId,
      dto.status,
    );
    return await this.createUserHandler.execute(cmd);
  }

  @Public()
  @Get()
  async getList(@Query() query: GetUsersRequest) {
    const users = await this.getUsersHandler.execute({
      organizationId: '',
      options: {
        departmentId: query.departmentId,
        status: query.status,
        roleId: query.roleId,
        search: query.search,
        limit: query.limit,
        offset: query.offset,
        includeDeleted: query.includeDeleted,
      },
    });
    return users;
  }

  @Public()
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<GetUserDetailsResponse> {
    const user = await this.getUserDetailsHandler.execute({ userId: id });
    return plainToInstance(
      GetUserDetailsResponse,
      {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  // @Public()
  // @Patch(':id')
  // async updateInfo(
  //   @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  //   @Body() dto: UpdateUserRequest,
  // ): Promise<UpdateOrganizationResponse> {
  //   const cmd = new UpdateOrganizationCommand(
  //     id,
  //     dto.organizationId,
  //     dto.status,
  //     dto.username,
  //     dto.password,
  //     dto.email,
  //     dto.departmentId,
  //     dto.status,
  //   );
  //   const org = await this.updateUserHandler.execute(cmd);
  //   return <UpdateOrganizationResponse>{
  //     id: org.id,
  //     name: org.name,
  //     status: org.status,
  //     phone: org.phone,
  //     email: org.email,
  //     taxCode: org.taxCode,
  //     website: org.website,
  //     address: org.address,
  //     createdAt: org.createdAt,
  //     updatedAt: org.updatedAt,
  //   };
  // }
}
