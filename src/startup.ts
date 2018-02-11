import { Injector, ReflectiveInjector } from 'injection-js';
import { config as dotEnvConfig } from 'dotenv';
import { HttpServer } from 'server';
import { Logger } from 'core/logger';
import { BodyParser } from 'core/parser';
import { FilmLocationsService } from 'services/filmLocations';
import { UpdateFilmDatabaseJob } from 'jobs/updateFilmDatabase';
import * as path from 'path';
import { DAO } from 'dao/dao';
import { DbAccess } from 'dao/dbAccess';
import { GeocodeAll } from 'jobs/geocodeAll';
import { GetNearbyLocations } from 'routes/location/getNearbyLocations';
import { Router } from 'core/router';
import { TextSearch } from 'utils/textSearch';
import { SearchLocations } from 'routes/location/searchLocations';
import { SolveRoutingProblem } from 'routes/location/solveRoutingProblem';
import { MapboxService } from 'services/mapboxService';
import { GiveIdToAllJob } from 'jobs/giveIdAll';

interface Configure {
  configure(): Bootstrap;
}

interface Bootstrap {
  bootstrap(): Run;
}

interface Run {
  run(): void;
}

export class Startup implements Configure, Bootstrap, Run {
  injector: Injector;
  asyncPreJobs: Promise<void>[] = [];

  configure() {
    dotEnvConfig();

    process.env.APP_ROOT_PATH = path.join(__dirname, '../../');

    this.injector = ReflectiveInjector.resolveAndCreate([
      DbAccess,
      DAO,
      GeocodeAll,
      MapboxService,
      UpdateFilmDatabaseJob,
      FilmLocationsService,
      TextSearch,
      Router,
      Logger,
      BodyParser,
      HttpServer,
      GiveIdToAllJob,

      GetNearbyLocations,
      SearchLocations,
      SolveRoutingProblem
    ]);

    this.injector.get(GetNearbyLocations);
    this.injector.get(SearchLocations);
    this.injector.get(SolveRoutingProblem);

    return <Bootstrap>this;
  }

  bootstrap() {
    let updateFilmDatabase = this.injector.get(UpdateFilmDatabaseJob);
    let giveIdToAll = this.injector.get(GiveIdToAllJob);
    let geocodeAll = this.injector.get(GeocodeAll);
    this.asyncPreJobs.push(updateFilmDatabase.run());
    this.asyncPreJobs.push(geocodeAll.run());
    this.asyncPreJobs.push(giveIdToAll.run());
    return <Run>this;
  }

  run() {
    Promise.all(this.asyncPreJobs).then(() => {
      let server = this.injector.get(HttpServer);
      server.start();
    });
  }
}
