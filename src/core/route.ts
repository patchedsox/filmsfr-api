import { ResponseBody, RequestBody } from 'shared/golden-gate';

export interface Request<I extends RequestBody> {
  body: I;
}

export interface Response<O extends ResponseBody> {
  body: O;
}

export interface RouteHandler<I extends RequestBody, O extends ResponseBody> {
  (payload: Request<I>): Promise<Response<O>>;
}

export interface Route {
  routes: {
    [handlerName: string]: RouteHandler<RequestBody, ResponseBody>;
  };
}