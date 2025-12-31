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
import {
  CreateAccountingEntryCommand,
  CreateAccountingEntryHandler,
  GetAccountingEntryDetailsQuery,
  GetAccountingEntriesQuery,
  GetAccountingEntryDetailsHandler,
  GetAccountingEntriesHandler,
} from '../../application';
import { Permissions } from 'src/modules/auth/presentation';
import {
  AccountingEntryResponse,
  CreateAccountingEntryRequest,
  GetAccountingEntriesRequest,
} from '../dto';
import { AccountingEntry } from '../../domain';

@Controller('accounting-entries')
export class AccountingEntryController {
  constructor(
    private readonly createHandler: CreateAccountingEntryHandler,
    private readonly getListHandler: GetAccountingEntriesHandler,
    private readonly getDetailsHandler: GetAccountingEntryDetailsHandler,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Permissions('ACCOUNTING_CREATE')
  @Post()
  async create(
    @Body() dto: CreateAccountingEntryRequest,
    @Query('userId') userId: string, // Temporary until AuthGuard puts user in request and we can extract it
  ): Promise<AccountingEntryResponse> {
    const cmd = new CreateAccountingEntryCommand(
      dto.organizationId,
      dto.entryType,
      dto.amount,
      userId || '00000000-0000-0000-0000-000000000000',
      dto.entryDate ? new Date(dto.entryDate) : undefined,
      dto.description,
      dto.assetId,
      dto.referenceType,
      dto.referenceId,
    );
    const result = await this.createHandler.execute(cmd);
    return this.toResponse(result);
  }

  @Permissions('ACCOUNTING_VIEW')
  @Get()
  async getList(
    @Query() query: GetAccountingEntriesRequest,
    @Query('organization_id') organizationId: string,
  ): Promise<{ data: AccountingEntryResponse[]; total: number }> {
    const q = new GetAccountingEntriesQuery(organizationId || '', {
      entryType: query.entryType,
      assetId: query.assetId,
      referenceType: query.referenceType,
      referenceId: query.referenceId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      limit: query.limit,
      offset: query.offset,
    });

    const result = await this.getListHandler.execute(q);
    return {
      data: result.data.map((item) => this.toResponse(item)),
      total: result.total,
    };
  }

  @Permissions('ACCOUNTING_VIEW')
  @Get(':id')
  async getDetails(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AccountingEntryResponse> {
    const query = new GetAccountingEntryDetailsQuery(id);
    const result = await this.getDetailsHandler.execute(query);
    return this.toResponse(result);
  }

  private toResponse(entry: AccountingEntry): AccountingEntryResponse {
    return new AccountingEntryResponse(entry);
  }
}
