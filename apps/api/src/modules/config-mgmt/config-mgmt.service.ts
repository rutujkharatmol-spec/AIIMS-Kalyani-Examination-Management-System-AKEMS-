import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ConfigMgmtService {
  // In-memory mock until database is fully connected
  private configs = [
    { key: 'hallTicketReleaseDays', value: 7, type: 'number', category: 'Examination', description: 'Days before exam to release hall ticket' },
    { key: 'maxReEvaluationAttempts', value: 2, type: 'number', category: 'Examination', description: 'Max re-evaluation attempts per subject' },
    { key: 'passwordMinLength', value: 8, type: 'number', category: 'Authentication', description: 'Minimum length for passwords' }
  ];

  async findAll(category?: string) {
    if (category) {
      return this.configs.filter(c => c.category === category);
    }
    return this.configs;
  }

  async update(key: string, value: any) {
    const index = this.configs.findIndex(c => c.key === key);
    if (index === -1) {
      throw new NotFoundException(`Config key ${key} not found`);
    }
    this.configs[index].value = value;
    return this.configs[index];
  }
}
