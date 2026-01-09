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
  constructor(private readonly tCtxService: TenantContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (user) {
      if (user.organizationId) {
        this.tCtxService.setTenantId(user.organizationId);
      }
      this.tCtxService.setUserId(user.id);
      this.tCtxService.setIsRoot(user.isRoot);
    }

    return next.handle();
  }
}
