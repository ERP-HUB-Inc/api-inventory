import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { Observable, map } from "rxjs";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly dtoClass: ClassConstructor<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => plainToInstance(this.dtoClass, data, { excludeExtraneousValues: true })));
  }
}
