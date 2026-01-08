import { Module, Global } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { TenantContextService } from './context/tenant-context.service';
import { TenantContextInterceptor } from './context/tenant-context.interceptor';

@Global()
@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: { mount: true },
        }),
    ],
    providers: [TenantContextService, TenantContextInterceptor],
    exports: [TenantContextService, TenantContextInterceptor],
})
export class SharedInfrastructureModule { }
