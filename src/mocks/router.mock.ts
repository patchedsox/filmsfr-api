import { Router } from 'core/router';
import { RouteHandlerFunc } from 'core/route';
import { RequestBody, ResponseBody, Action } from 'shared/goldengate24k';
import { ActionResponse } from 'shared/goldengate24k';

export class MockRouter implements Router {
  handlers: { [s: string]: RouteHandlerFunc<RequestBody, ResponseBody>; };
  register(name: string, handler: RouteHandlerFunc<RequestBody, ResponseBody>): void {
    return;
  }
  route(req: Action<RequestBody>): Promise<ActionResponse<ResponseBody>> {
    throw new Error('Method not implemented.');
  }
}