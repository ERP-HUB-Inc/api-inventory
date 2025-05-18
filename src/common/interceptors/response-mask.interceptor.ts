import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class MaskingInterceptor implements NestInterceptor {
  private readonly sensitiveKeys = [
    'password',
    'pin',
    'secret',
    'ssn',
    'token',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable {
    return next.handle().pipe(
      map((data) => {
        return this.maskSensitiveFields(data);
      }),
    );
  }

  private maskSensitiveFields(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.maskSensitiveFields(item));
    } else if (typeof data === 'object' && data !== null) {
      const maskedObj: Record = {};
      for (const key of Object.keys(data)) {
        if (this.sensitiveKeys.includes(key.toLowerCase())) {
          maskedObj[key] = '****';
        } else {
          maskedObj[key] = this.maskSensitiveFields(data[key]);
        }
      }
      return maskedObj;
    }
    return data;
  }
}
