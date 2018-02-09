export * from './filmLocation';
import { FilmLocationSchema } from 'schemas/filmLocation';

export interface MainSchema {
  filmLocations: FilmLocationSchema[];
}

export interface BaseSchema { }