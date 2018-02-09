import { FilmLocationSchema } from 'schemas';
import { LoDashExplicitWrapper } from 'lodash';
import { Injectable } from 'injection-js';
import { DbAccess } from 'dao/dbAccess';

@Injectable()
export class DAO {
  filmLocations: LoDashExplicitWrapper<FilmLocationSchema[]>;
  constructor(private dbAccess: DbAccess) {
    this.filmLocations = this.dbAccess.db.get('FilmLocations');
  }
} 