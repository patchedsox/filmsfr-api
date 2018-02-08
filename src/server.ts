import { Logger } from 'core/logger';
import { Injectable } from 'injection-js';

@Injectable()
export class Server {
  constructor(private logger: Logger) { }
  start() {
    this.logger.trace('Started!');
  }
}