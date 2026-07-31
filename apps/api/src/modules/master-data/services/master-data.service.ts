import { Injectable } from '@nestjs/common';

@Injectable()
export class MasterDataService {
  async getDepartments() {
    return [{ id: 'dept-1', name: 'Anatomy', code: 'ANA' }];
  }
}
