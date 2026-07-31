import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async getDeanDashboardMetrics() {
    return {
      passPercentage: 92.5,
      totalEvaluationsPending: 45,
      difficultSubjects: ['ANAT-101', 'PHYS-201']
    };
  }
}
