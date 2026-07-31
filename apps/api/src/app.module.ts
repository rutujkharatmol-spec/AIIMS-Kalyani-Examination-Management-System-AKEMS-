import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ConfigMgmtModule } from './modules/config-mgmt/config-mgmt.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { NotificationModule } from './modules/notification/notification.module';
import { BarcodeModule } from './modules/barcode/barcode.module';
import { ExcelModule } from './modules/excel/excel.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { StudentModule } from './modules/student/student.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { RoomModule } from './modules/room/room.module';
import { ExamCycleModule } from './modules/exam-cycle/exam-cycle.module';
import { SeatingModule } from './modules/seating/seating.module';
import { QuestionBankModule } from './modules/question-bank/question-bank.module';
import { QuestionPaperModule } from './modules/question-paper/question-paper.module';
import { HallTicketModule } from './modules/hall-ticket/hall-ticket.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AnswerSheetModule } from './modules/answer-sheet/answer-sheet.module';
import { EvaluationModule } from './modules/evaluation/evaluation.module';
import { ReEvaluationModule } from './modules/re-evaluation/re-evaluation.module';
import { ResultsModule } from './modules/results/results.module';
import { MarksheetModule } from './modules/marksheet/marksheet.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // DEV ONLY: Syncs schema to DB automatically
        ssl: {
          rejectUnauthorized: false, // Required for hosted databases like Neon
        },
      }),
      inject: [ConfigService],
    }),
    DashboardModule, 
    ConfigMgmtModule, 
    AuthModule, 
    AuditModule, 
    FileStorageModule, 
    WorkflowModule,
    NotificationModule,
    BarcodeModule,
    ExcelModule,
    SchedulerModule,
    MasterDataModule,
    StudentModule,
    FacultyModule,
    RoomModule,
    ExamCycleModule,
    SeatingModule,
    QuestionBankModule,
    QuestionPaperModule,
    HallTicketModule,
    AttendanceModule,
    AnswerSheetModule,
    EvaluationModule,
    ReEvaluationModule,
    ResultsModule,
    MarksheetModule,
    AnalyticsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
