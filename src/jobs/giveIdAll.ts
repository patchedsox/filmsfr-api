import { Injectable } from 'injection-js';
import { Logger } from 'core/logger';
import { Job } from 'jobs/job';
import { DAO } from 'dao/dao';
import * as shortId from 'shortid';

@Injectable()
export class GiveIdToAllJob implements Job {
  constructor(private logger: Logger, private dao: DAO) { }
  run(): Promise<void> {
    this.dao.filmLocations.filter(m => m.id === undefined).each(m => {
      m.id = shortId.generate();
      this.logger.trace(m.id);
    }).write();
    return Promise.resolve();
  }
}
