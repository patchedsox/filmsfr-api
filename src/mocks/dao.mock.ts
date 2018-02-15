import { DAO } from 'dao/dao';
import { LoDashExplicitWrapper } from 'lodash';
import { FilmLocationSchema } from 'goldengate24k';
import { MockDbAccess } from '.';

export class MockDao extends DAO {
  filmLocations: LoDashExplicitWrapper<FilmLocationSchema[]>;
  constructor() { 
    super(new MockDbAccess());
  }
} 