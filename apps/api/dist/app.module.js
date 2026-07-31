"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const config_mgmt_module_1 = require("./modules/config-mgmt/config-mgmt.module");
const auth_module_1 = require("./modules/auth/auth.module");
const audit_module_1 = require("./modules/audit/audit.module");
const file_storage_module_1 = require("./modules/file-storage/file-storage.module");
const workflow_module_1 = require("./modules/workflow/workflow.module");
const notification_module_1 = require("./modules/notification/notification.module");
const barcode_module_1 = require("./modules/barcode/barcode.module");
const excel_module_1 = require("./modules/excel/excel.module");
const scheduler_module_1 = require("./modules/scheduler/scheduler.module");
const master_data_module_1 = require("./modules/master-data/master-data.module");
const student_module_1 = require("./modules/student/student.module");
const faculty_module_1 = require("./modules/faculty/faculty.module");
const room_module_1 = require("./modules/room/room.module");
const exam_cycle_module_1 = require("./modules/exam-cycle/exam-cycle.module");
const seating_module_1 = require("./modules/seating/seating.module");
const question_bank_module_1 = require("./modules/question-bank/question-bank.module");
const question_paper_module_1 = require("./modules/question-paper/question-paper.module");
const hall_ticket_module_1 = require("./modules/hall-ticket/hall-ticket.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const answer_sheet_module_1 = require("./modules/answer-sheet/answer-sheet.module");
const evaluation_module_1 = require("./modules/evaluation/evaluation.module");
const re_evaluation_module_1 = require("./modules/re-evaluation/re-evaluation.module");
const results_module_1 = require("./modules/results/results.module");
const marksheet_module_1 = require("./modules/marksheet/marksheet.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    autoLoadEntities: true,
                    synchronize: true, // DEV ONLY: Syncs schema to DB automatically
                    ssl: {
                        rejectUnauthorized: false, // Required for hosted databases like Neon
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            dashboard_module_1.DashboardModule,
            config_mgmt_module_1.ConfigMgmtModule,
            auth_module_1.AuthModule,
            audit_module_1.AuditModule,
            file_storage_module_1.FileStorageModule,
            workflow_module_1.WorkflowModule,
            notification_module_1.NotificationModule,
            barcode_module_1.BarcodeModule,
            excel_module_1.ExcelModule,
            scheduler_module_1.SchedulerModule,
            master_data_module_1.MasterDataModule,
            student_module_1.StudentModule,
            faculty_module_1.FacultyModule,
            room_module_1.RoomModule,
            exam_cycle_module_1.ExamCycleModule,
            seating_module_1.SeatingModule,
            question_bank_module_1.QuestionBankModule,
            question_paper_module_1.QuestionPaperModule,
            hall_ticket_module_1.HallTicketModule,
            attendance_module_1.AttendanceModule,
            answer_sheet_module_1.AnswerSheetModule,
            evaluation_module_1.EvaluationModule,
            re_evaluation_module_1.ReEvaluationModule,
            results_module_1.ResultsModule,
            marksheet_module_1.MarksheetModule,
            analytics_module_1.AnalyticsModule
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map