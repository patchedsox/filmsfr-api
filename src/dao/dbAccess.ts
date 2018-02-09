import { MainSchema } from 'schemas';
const FileSync = require('lowdb/adapters/FileSync');
import { AdapterSync, Lowdb } from 'lowdb';
import { join } from 'path';
import { Injectable } from 'injection-js';
import * as low from 'lowdb';

@Injectable()
export class DbAccess {
  db: Lowdb<MainSchema, AdapterSync<MainSchema>>;
  constructor() {
    const adapter: AdapterSync<MainSchema> = new FileSync(join(process.env.APP_ROOT_PATH, '/db/low.json'));
    this.db = low(adapter);
    this.db
      .defaults({
        FilmLocations: []
      })
      .write();
  }
}