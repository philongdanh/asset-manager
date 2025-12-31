import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateDepartmentRequest,
  GetDepartmentsRequest,
  UpdateDepartmentRequest,
  DepartmentResponse,
} from '../dto';
import {
  CreateDepartmentCommand,
  UpdateDepartmentCommand,
  DeleteDepartmentCommand,
  GetDepartmentsQuery,
  GetDepartmentDetailsQuery,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';
import { Department } from '../../domain';

@Controller('departments')
export class DepartmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Permissions('DEPARTMENT_VIEW')
  @Get()
  async getList(
    @Query() query: GetDepartmentsRequest,
  ): Promise<{ data: DepartmentResponse[]; total: number }> {
    const result: { data: Department[]; total: number } =
      await this.queryBus.execute(
        new GetDepartmentsQuery(query.organizationId || '', {
          parentId: query.parentId,
          includeDeleted: query.includeDeleted,
        }),
      );
    return {
      data: result.data.map((dept) => new DepartmentResponse(dept)),
      total: result.total,
    };
  }

  @Permissions('DEPARTMENT_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<DepartmentResponse> {
    const dept: Department = await this.queryBus.execute(
      new GetDepartmentDetailsQuery(id),
    );
    return new DepartmentResponse(dept);
  }

  @HttpCode(HttpStatus.CREATED)
  @Permissions('DEPARTMENT_CREATE')
  @Post()
  async create(
    @Body() dto: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const cmd = new CreateDepartmentCommand(
      dto.organizationId,
      dto.name,
      dto.parentId,
    );
    const dept: Department = await this.commandBus.execute(cmd);
    return new DepartmentResponse(dept);
  }

  @Permissions('DEPARTMENT_UPDATE')
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    const cmd = new UpdateDepartmentCommand(id, dto.name, dto.parentId);
    const dept: Department = await this.commandBus.execute(cmd);
    return new DepartmentResponse(dept);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('DEPARTMENT_DELETE')
  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteDepartmentCommand(id));
  }
}
