import { Controller, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { ConfigMgmtService } from './config-mgmt.service';

@Controller('config')
export class ConfigMgmtController {
  constructor(private readonly configService: ConfigMgmtService) {}

  @Get()
  async getConfigs(@Query('category') category: string) {
    const data = await this.configService.findAll(category);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':key')
  async updateConfig(@Param('key') key: string, @Body('value') value: any) {
    const data = await this.configService.update(key, value);
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
