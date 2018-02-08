interface Configure {
  configure(): Bootstrap;
}
import { Injector, ReflectiveInjector } from 'injection-js';
import { config as dotEnvConfig } from 'dotenv';

import { HttpServer } from 'server';
import { Logger } from 'core/logger';
import { BodyParser } from 'core/parser';

interface Bootstrap {
  bootstrap(): Run;
}

interface Run {
  run(): void;
}

export class Startup implements Configure, Bootstrap, Run {
  injector: Injector;

  configure() {
    dotEnvConfig();

    this.injector = ReflectiveInjector.resolveAndCreate([
      Logger,      
      BodyParser,
      HttpServer,
    ]);

    return <Bootstrap>this;
  }

  bootstrap() {
    return <Run>this;
  }

  run() {
    let server = this.injector.get(HttpServer);
    server.start();
  }
}
