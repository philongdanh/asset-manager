import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from './tenant-context.service';
import { JwtPayload } from '../../../modules/auth/presentation/interfaces/jwt-payload.interface';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
    constructor(private readonly tenantContextService: TenantContextService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;

        if (user) {
            if (user.organizationId) {
                this.tenantContextService.setTenantId(user.organizationId);
            }
            this.tenantContextService.setUserId(user.id);
            this.tenantContextService.setIsRoot(user.isRoot);
        }

        return next.handle();
    }
}
