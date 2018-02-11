import { Injectable } from 'injection-js';

@Injectable()
export class TextSearch {
  // tslint:disable-next-line:no-any
  hasInAnyKey(obj: { [k: string]: string } | any, searchText: string): boolean {
    if (typeof searchText !== 'string') {
      return false;
    }
    return Object.keys(obj)
      .filter(k => typeof k === 'string')
      .filter(k => typeof obj[k] === 'string')
      .some(k => obj[k].toLowerCase().indexOf(searchText.toLowerCase()) > -1);
  }
}