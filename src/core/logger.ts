import { Injectable } from 'injection-js';

@Injectable()
export class Logger {
  trace(message: string) {
    process.stdout.write(message + '\n');
  }
}