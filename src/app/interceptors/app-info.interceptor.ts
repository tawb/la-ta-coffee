import { HttpInterceptorFn } from '@angular/common/http';

export const appInfoInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({
    headers: req.headers.set('X-App-Name', 'la-ta-coffee-ng')
  });
  console.log('Outgoing request:', clonedReq.method, clonedReq.url);
  return next(clonedReq);
};