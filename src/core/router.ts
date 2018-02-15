import { Injectable } from 'injection-js';
import { RouteHandlerFunc } from 'core/route';
import { RequestBody, ResponseBody, Action } from 'goldengate24k';

@Injectable()
export class Router {
  handlers: {
    [s: string]: RouteHandlerFunc<RequestBody, ResponseBody>;
  } = {};
  register(name: string, handler: RouteHandlerFunc<RequestBody, ResponseBody>) {
    this.handlers[name] = handler;
  }
  route(req: Action<RequestBody>) {
    return this.handlers[req.type](req);
  }
}
