import { RouteHandler } from 'core/route';
import { SolveRoutingProblemRequest, SolveRoutingProblemResponse, Action } from 'shared/goldengate24k';
import { Injectable } from 'injection-js';
import { ActionResponse, FilmLocationSchema } from 'shared/goldengate24k/src';
import { Router } from 'core/router';
import { DAO } from 'dao/dao';
import * as turf from '@turf/turf';
import * as cheapRuler from 'cheap-ruler';
import { MapboxService } from 'services/mapboxService';

@Injectable()
export class SolveRoutingProblem extends RouteHandler<SolveRoutingProblemRequest, SolveRoutingProblemResponse> {
  private ruler = cheapRuler(44.4, 'meters');
  constructor(private dao: DAO, router: Router, private mapService: MapboxService) {
    super(router);
  }
  handler(payload: Action<SolveRoutingProblemRequest>): Promise<ActionResponse<SolveRoutingProblemResponse>> {
    let results = this.dao.filmLocations
      .filter(c => c.coordinates)
      .orderBy((item) => turf.distance(
        [payload.value.coordinates.lng, payload.value.coordinates.lat],
        [item.coordinates.lng, item.coordinates.lat], {
          units: 'meters'
        }))
      .take(11)
      .value();

    let start = {
      longitude: payload.value.coordinates.lng,
      latitude: payload.value.coordinates.lat
    };

    results.unshift({
      id: 'start',
      title: 'Start',
      locations: 'You are here',
      coordinates: {
        lng: start.longitude,
        lat: start.latitude
      }
    } as any);

    let locations = () => results.map((c, i) => ({
      longitude: c.coordinates.lng,
      latitude: c.coordinates.lat
    }));

    return this.mapService
      .optimize(locations())
      .then((r: any) => {
        let route =
          r.waypoints
          && r.trips
          && {
            trips: r.trips || {},
            waypoints: r.waypoints
          };

        route.waypoints.forEach((wp: any, i: number) => {
          let temp = results[i];
          results[i] = results[wp.waypoint_index];
          results[wp.waypoint_index] = temp;
        });

        return this.mapService.getDirections(locations()).then((result) => {
          results.map((l: FilmLocationSchema, i: number) => {
            if (i === results.length - 1) {
              return;
            }
            let nextPoint = results[i + 1];
            (results[i] as any).routeCoordinates =
              this.ruler.lineSlice(
                [l.coordinates.lng, l.coordinates.lat],
                [nextPoint.coordinates.lng, nextPoint.coordinates.lat],
                result.entity.routes[0].geometry.coordinates
              );
          });

          return (<ActionResponse<SolveRoutingProblemResponse>>{
            type: this.type,
            value: {
              locationsWithRouteCoordinates: results as any,
              traceId: payload.value.traceId
            }
          });
        });
      });
  }
}
