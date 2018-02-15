import { ResponseBody, RequestBody, ActionResponse, Action } from 'goldengate24k';
import { Router } from 'core/router';

export interface RouteHandlerFunc<I extends RequestBody, O extends ResponseBody> {
  (payload: Action<I>): Promise<ActionResponse<O>>;
}

export abstract class RouteHandler<I extends RequestBody, O extends ResponseBody> {
  type?: string;
  abstract handler(payload: Action<I>): Promise<ActionResponse<O>>;
  constructor(private router: Router) {
    this.type = this.constructor.name;
    this.router.register(this.type, this.handler.bind(this));
  }
}
