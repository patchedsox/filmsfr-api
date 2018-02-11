import { Injectable } from 'injection-js';
import * as request from 'request';

const MapboxClient = require('mapbox');

@Injectable()
export class MapboxService {
  // tslint:disable-next-line:no-any
  client: any;

  constructor() {
    this.client = new MapboxClient(process.env.APP_MAP_BOX_KEY);
  }

  geocode(req: { address: string }) {
    return this.client.geocodeForward(req.address);
  }

  getDirections(
    locations: { latitude: number; longitude: number }[]
  )
    : Promise<any> {
    return this.client.getDirections(
      locations,
      {
        profile: 'walking',
        alternatives: false,
        geometry: 'geojson'
      }
    ).then((result: any) => {
      return result;
    });
  }

  optimize(
    locations: { latitude: number; longitude: number }[]
  )
    : Promise<any> {
    return new Promise((resolve, reject) => {
      request.get(
        // tslint:disable-next-line:max-line-length
        `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${locations.map(m => [m.longitude, m.latitude].toString()).join(';')}?geometries=geojson&source=first&access_token=pk.eyJ1IjoiZy1tYW4iLCJhIjoiY2pkZzhzNm9vMGJ5ZzJ3bnoyd2NsaW12MCJ9.Ujhx7KNL5irrxpCOFS3wAA`,
        {
        },
        (err, resp) => {
          resolve(JSON.parse(resp.body));
        });
    });
  }
}
