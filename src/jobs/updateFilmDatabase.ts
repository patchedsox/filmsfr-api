import { Injectable } from 'injection-js';
import { FilmLocationsService } from 'services/filmLocations';
import { Logger } from 'core/logger';
import { Job } from 'jobs/job';
import { DAO } from 'dao/dao';

@Injectable()
export class UpdateFilmDatabaseJob implements Job {
  constructor(private logger: Logger, private filmLocationsService: FilmLocationsService, private dao: DAO) {}
  run(): Promise<void> {
    if (this.dao.filmLocations.some(c => c.title !== undefined).value()) {
      return Promise.resolve();
    }

    return this.filmLocationsService
      .getAll()
      .then(data => {
        this.dao.filmLocations.push(...data).write();
      })
      .catch(error => this.logger.trace('Something went wrong with updating the database', error));
  }
}
