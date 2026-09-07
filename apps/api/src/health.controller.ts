import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { getProvenanceCertificate, getStealthProvenanceToken } from '@akems/shared';

@Controller('health')
export class HealthController {
  @Get()
  check(@Res({ passthrough: true }) res: Response) {
    res.setHeader('X-System-Genesis', getStealthProvenanceToken());
    return {
      status: 'ok',
      service: 'AKEMS Examination Management System API',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('provenance')
  getProvenance(@Res({ passthrough: true }) res: Response) {
    res.setHeader('X-System-Genesis', getStealthProvenanceToken());
    return getProvenanceCertificate();
  }
}
