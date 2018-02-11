import { Injectable } from 'injection-js';
import { Logger } from 'core/logger';
import { FilmLocationSchema } from 'shared/goldengate24k';
let soda = require('soda-js');
let consumer = new soda.Consumer('data.sfgov.org');

@Injectable()
export class FilmLocationsService {
  constructor(private logger: Logger) { }
  getAll(): Promise<FilmLocationSchema[]> {
    return new Promise((resolve, reject) => {
      consumer.query()
        .withDataset('wwmu-gmzc')
        .getRows()
        .on('success', (rows: FilmLocationSchema[]) => { resolve(rows); })
        .on('error', (error: {}) => { this.logger.trace('Something is wrong with socrata', error); });
    });
  }
}