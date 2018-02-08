interface Configure {
  configure(): Bootstrap;
}
import { Injector, ReflectiveInjector } from 'injection-js';
import { config as dotEnvConfig } from 'dotenv';
import { Server } from 'server';

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
    ]);

    return <Bootstrap>this;
  }

  bootstrap() {
    return <Run>this;
  }

  run() {
    let server = this.injector.get(Server);
    server.start();
  }
}
