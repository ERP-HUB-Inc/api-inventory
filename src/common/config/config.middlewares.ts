import { TraceIdMiddleware } from '@middlewares/index';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

export function configMiddlewares(app: any) {
  app.use(new TraceIdMiddleware().use);
  app.use(compression());
  app.use(cookieParser());
}
