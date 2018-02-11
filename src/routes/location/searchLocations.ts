import { RouteHandler } from 'core/route';
import { SearchLocationsRequest, SearchLocationsResponse, Action } from 'shared/goldengate24k';
import { Injectable } from 'injection-js';
import { ActionResponse } from 'shared/goldengate24k/src';
import { Router } from 'core/router';
import { DAO } from 'dao/dao';
import { TextSearch } from 'utils/textSearch';

@Injectable()
export class SearchLocations extends RouteHandler<SearchLocationsRequest, SearchLocationsResponse> {
  constructor(private dao: DAO, router: Router, private textSearch: TextSearch) {
    super(router);
  }
  handler(payload: Action<SearchLocationsRequest>): Promise<ActionResponse<SearchLocationsResponse>> {
    if (!payload.value.text || payload.value.text.length < 2) {
      return Promise.resolve(<ActionResponse<SearchLocationsResponse>>{
        type: this.type
      });
    }
    let results = this.dao.filmLocations
      .orderBy('title')
      .filter(c => c.coordinates !== undefined)
      .filter(c => {
        return this.textSearch.hasInAnyKey(c, payload.value.text);
      })
      .slice(payload.value.skip, payload.value.skip + payload.value.take)
      .value();
    return Promise.resolve(<ActionResponse<SearchLocationsResponse>>{
      type: this.type,
      value: {
        locations: results,
        traceId: payload.value.traceId
      }
    });
  }
}
