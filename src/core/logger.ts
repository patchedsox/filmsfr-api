import { Injectable } from 'injection-js';

@Injectable()
export class Logger {
  // tslint:disable-next-line:no-empty
  constructor() { }
  trace(message: string, err?: {}) {
    process.stdout.write(message + '\n' + (err ? JSON.stringify(err) : ''));
  }
}