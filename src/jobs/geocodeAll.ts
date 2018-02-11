import { Injectable } from 'injection-js';
import { Job } from 'jobs/job';
import { DAO } from 'dao/dao';
import { TaskLimit } from 'utils/taskLimit';
import { Logger } from 'core/logger';
import { MapboxService } from 'services/mapboxService';

@Injectable()
export class GeocodeAll implements Job {
  constructor(private mapbox: MapboxService, private dao: DAO, private logger: Logger) { }
  run(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let taskLimit = new TaskLimit<any>(25, this.logger);
      taskLimit.onFinish(results => {
        this.dao.filmLocations.write();
        resolve();
      });
      let filtered = this.dao.filmLocations.filter(
        c =>
          c.coordinateNotFound !== true &&
          c.coordinates === undefined &&
          c.locations !== '' &&
          c.locations !== undefined
      );

      if (filtered.size().value() === 0) {
        return resolve();
      }

      filtered
        .each((c, i) => {
          return taskLimit.push(done => {
            this.mapbox
              .geocode({
                address: c.locations + ', San Francisco, CA'
              })
              .then((r: any) => {
                if (
                  r.json.results[0] === undefined ||
                  r.json.results[0].geometry === undefined ||
                  r.json.results[0].geometry.location === undefined ||
                  r.json.results[0].geometry.location.lat === undefined
                ) {
                  // tslint:disable-next-line:no-any
                  if ((r.json.status as any) !== 'OK') {
                    c.coordinateNotFound = true;
                    this.logger.trace(r.json.status + ': ' + i);
                  }
                  return done(new Error());
                }
                c.coordinates = {
                  lng: r.json.results[0].geometry.location.lng,
                  lat: r.json.results[0].geometry.location.lat
                  // tslint:disable-next-line:no-any
                } as any;
                this.logger.trace('Finished: ' + i);
                done(r);
              })
              .catch((err: any) => {
                c.coordinateNotFound = true;
                this.logger.trace('Error: ' + i);
                done(new Error(err));
              });
          });
        })
        .value();
    });
  }
}
