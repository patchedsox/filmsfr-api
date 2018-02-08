import {
  RouteHandler, Request, Response
} from 'core/route';
import {
  GetNearbyLocationsRequest,
  GetNearbyLocationsResponse
} from 'shared/goldengate24k';

export class GetNearbyLocations implements RouteHandler<GetNearbyLocationsRequest, GetNearbyLocationsResponse> {
  handler(payload: Request<GetNearbyLocationsRequest>): Promise<Response<GetNearbyLocationsResponse>> {
    return Promise.resolve(<Response<GetNearbyLocationsResponse>>{});
  }
}
