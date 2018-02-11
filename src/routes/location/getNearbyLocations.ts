import { RouteHandler } from 'core/route';
import { GetNearbyLocationsRequest, GetNearbyLocationsResponse, Action } from 'shared/goldengate24k';
import { Injectable } from 'injection-js';
import { ActionResponse } from 'shared/goldengate24k/src';
import { Router } from 'core/router';
import { DAO } from 'dao/dao';
import * as turf from '@turf/turf';

@Injectable()
export class GetNearbyLocations extends RouteHandler<GetNearbyLocationsRequest, GetNearbyLocationsResponse> {
  constructor(private dao: DAO, router: Router) {
    super(router);
  }
  handler(payload: Action<GetNearbyLocationsRequest>): Promise<ActionResponse<GetNearbyLocationsResponse>> {
    let results = this.dao.filmLocations.filter(c => {
      return c.coordinates && turf.inside(
        turf.point([
          c.coordinates.lng,
          c.coordinates.lat
        ]),
        turf.circle(
          [
            payload.value.coordinates.lng,
            payload.value.coordinates.lat
          ],
          payload.value.radius,
          { units: 'meters' }
        )
      );
    }).value();
    return Promise.resolve(<ActionResponse<GetNearbyLocationsResponse>>{
      type: this.type,
      value: {
        locations: results,
        traceId: payload.value.traceId
      }
    });
  }
}
