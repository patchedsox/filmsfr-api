import {
  Route,
  Request,
  Response
} from 'core/route';
import {
  GetNearbyLocations,
  GetNearbyLocationsRequest,
  GetNearbyLocationsResponse
} from 'shared/goldengate24k';
import {
  SearchNearbyLocations,
  SearchNearbyLocationsRequest,
  SearchNearbyLocationsResponse
} from 'shared/goldengate24k';
import { Injectable } from 'injection-js';

@Injectable()
export class LocationRoute implements Route {
  routes = {
    [GetNearbyLocations.type]: (req: Request<GetNearbyLocationsRequest>) => {
      return Promise.resolve(<Response<GetNearbyLocationsResponse>>{});
    },

    [SearchNearbyLocations.type]: (req: Request<SearchNearbyLocationsRequest>) => {
      return Promise.resolve(<Response<SearchNearbyLocationsResponse>>{});
    }
  };
}
