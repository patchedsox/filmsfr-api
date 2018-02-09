import { Injectable } from 'injection-js';
import { Job } from 'jobs/job';
import { GoogleMapsService } from 'services/googleMaps';
import { DAO } from 'dao/dao';
import { TaskLimit } from 'utils/taskLimit';
import { MapApiResponse, GeoCodeResponsePayload } from '@google/maps';
import { Logger } from 'core/logger';

@Injectable()
export class GeocodeAll implements Job {
  constructor(private googleMaps: GoogleMapsService, private dao: DAO, private logger: Logger) { }
  run(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // if (this.dao.filmLocations.)
      let taskLimit = new TaskLimit<MapApiResponse<GeoCodeResponsePayload>>(25, this.logger);
      taskLimit.onFinish((results) => {
        this.dao.filmLocations.write();
        resolve();
      });
      this.dao.filmLocations.filter(c => 
        c.coordinateNotFound !== true
        && c.coordinates === undefined
        && c.locations !== ''
        && c.locations !== undefined).each((c, i) => {
          return taskLimit.push((done) => {
            this.googleMaps.geocode({
              address: c.locations + ', San Francisco, CA'
            }).then(r => {
              if (
                r.json.results[0] === undefined
                || r.json.results[0].geometry === undefined
                || r.json.results[0].geometry.location === undefined
                || r.json.results[0].geometry.location.lat === undefined
              ) {
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
              .catch(err => {
                c.coordinateNotFound = true;
                this.logger.trace('Error: ' + i);
                done(new Error(err));
              });
          });
        }).value();
    });
  }
}