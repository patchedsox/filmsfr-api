import { createClient, GoogleMapsClient, GeocoderRequest, GeoCodeResponsePayload, MapApiResponse } from '@google/maps';
import { Injectable } from 'injection-js';

@Injectable()
export class GoogleMapsService {
  private client: GoogleMapsClient;

  constructor() {
    this.client = createClient({
      key: process.env.APP_GOOGLE_MAPS_KEY
    });
  }

  geocode(request: GeocoderRequest) {
    return new Promise<MapApiResponse<GeoCodeResponsePayload>>((resolve, reject) => {
      this.client.geocode(request, (error, response) => {
        if (error) { reject(new Error(error)); }
        resolve(response);
      });
    });
  }
}