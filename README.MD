# filmsfr-api

This is the back-end of "**filmsfr**" project

## Start

#### Important
  This project uses [goldengate24k](https://github.com/patchedsox/goldengate24k) as interface to accommodate requests from [filmsfr-web](https://github.com/patchedsox/filmsfr-web) and to provide shared schemas

  **Test** structure is not yet complete, however included for demonstration purposes. You can find expected improvements to make at the end of this markdown

Click here for [yarn](https://yarnpkg.com/en/docs/install) 

To start this project, use:
```
yarn build && yarn start
```

Unit tests:
```
yarn test
```

To run the project in a simple docker container, use:
```
yarn up
```


## Ideas

1. Self explanatory folder / class patterns and naming
2. Separated and easy to implement route handlers
3. Tests side by side with implementations
4. Mocha unit tests
5. Angular inspired inversion of control (DI)
6. Object oriented scalable code base

#### Pending improvements

- Improve how tests are initialized and ran with a global entry-point / setup
  - Only implemented test is "getNearbyLocations.spec.ts". Initialization for test environment at the top of that file should be moved to a global context for a more friendly test development experience
- Improve logger with additional features, enable logging across the application
- Introduce scheduled updates of the "locations" data from the source
- Implement scope management helpers around "injection-js" for making IoC scope management, and transient instatiation more intuitive

#### Notes for development

This is the pattern of registration of handlers in startup.ts

``` typescript
    this.injector = ReflectiveInjector.resolveAndCreate([
      GetNearbyLocations,
      ...
      ..
      .
    ]);

    this.injector.get(GetNearbyLocations);
```

It is important that the type of the action declared in goldengate24k is the exact name of the class of the action:

What would look goldengate24k like:

``` typescript
/// Making this const is very important
const TYPE = 'GetNearbyLocations';

export class GetNearbyLocations extends Requestable<GetNearbyLocationsRequest, GetNearbyLocationsResponse> {
  readonly type = TYPE;
}
```

Can be implemented in this project like: 

``` typescript


// Class name is very important!
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
```

Base constructor of "RouteHandler" will do the rest

## NOTE!
Right now duplicate route handler names are not handled, be careful to not have same named handler classes twice
