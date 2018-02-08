import { ResponseBody, RequestBody } from 'shared/goldengate24k';

export interface Request<I extends RequestBody> {
  body: I;
}

export interface Response<O extends ResponseBody> {
  body: O;
}

export class RouteHandler<I extends RequestBody, O extends ResponseBody> {
  type?: string;
  constructor() { this.type = this.constructor.name; }
  handler(payload: Request<I>): Promise<Response<O>> {
    throw Error('Not implemented');
  }
}

export interface Route {
  routes: {
    [handlerName: string]: RouteHandler<RequestBody, ResponseBody>;
  };
}