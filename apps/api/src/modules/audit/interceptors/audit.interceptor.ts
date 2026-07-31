import { Injectable, CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    // Only audit mutations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      console.log(`[AUDIT PENDING] User mutation intercepted on ${req.url}`);
    }

    return next.handle().pipe(
      tap((data) => {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          // Fire event to async audit logging service here
          console.log(`[AUDIT COMPLETE] Mutation on ${req.url} successful`);
        }
      }),
    );
  }
}
