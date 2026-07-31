"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let AuditInterceptor = class AuditInterceptor {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        // Only audit mutations
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            console.log(`[AUDIT PENDING] User mutation intercepted on ${req.url}`);
        }
        return next.handle().pipe((0, operators_1.tap)((data) => {
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                // Fire event to async audit logging service here
                console.log(`[AUDIT COMPLETE] Mutation on ${req.url} successful`);
            }
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)()
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map