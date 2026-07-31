import { Controller, Get } from '@nestjs/common';
import { MasterDataService } from '../services/master-data.service';

@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Get('departments')
  async getDepartments() {
    return { success: true, data: await this.masterDataService.getDepartments() };
  }
}
