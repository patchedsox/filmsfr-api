// tslint:disable:no-unused-expression

// TODO: THIS PAGE NEEDS TO BE REORGANIZED TO A GLOBAL ENTRY POINT

import 'reflect-metadata';
import { join } from 'path';
import { config as dotEnvConfig } from 'dotenv';
require('source-map-support').install();
require('app-module-path').addPath(join(__dirname, '../../'));
import * as chai from 'chai';

dotEnvConfig();
process.env.APP_ROOT_PATH = join(__dirname, '../../../../');

import { MockRouter, MockDao } from 'mocks';
import { GetNearbyLocations } from './getNearbyLocations';
import { Action } from 'shared/goldengate24k';
import { GetNearbyLocationsRequest } from 'shared/goldengate24k/src';

describe('Get nearby locations', function () {
  it('Returns only the ones with coordinates', () => {
    let getLocations = new GetNearbyLocations(new MockDao(), new MockRouter());
    return getLocations.handler(<Action<GetNearbyLocationsRequest>>{
      type: getLocations.type,
      value: {
        coordinates: {
          lng: -122.3893566,
          lat: 37.7908379
        },
        radius: 1000
      }
    }).then(t => {
      // tslint:disable-next-line:no-console
      let didFail = t.value.locations.some(s => s.coordinates === undefined);
      chai.expect(didFail).is.false;
      return didFail;
    });
  });
});