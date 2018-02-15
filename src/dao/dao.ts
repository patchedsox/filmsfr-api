import { LoDashExplicitWrapper } from 'lodash';
import { Injectable } from 'injection-js';
import { DbAccess } from 'dao/dbAccess';
import { FilmLocationSchema } from 'goldengate24k';

@Injectable()
export class DAO {
  filmLocations: LoDashExplicitWrapper<FilmLocationSchema[]>;
  constructor(private dbAccess: DbAccess) {
    this.filmLocations = this.dbAccess.db.get('FilmLocations');
  }
} 