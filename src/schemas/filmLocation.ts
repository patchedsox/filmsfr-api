export interface FilmLocationSchema {
  title: string;
  releaseYear: number;
  locations: string;
  funFacts: string;
  productionCompany: string;
  distributor: string;
  director: string;
  writer: string;
  actor1: string;
  actor2: string;
  actor3: string;
  coordinateNotFound: boolean;
  coordinates: {
    lng: number,
    lat: number
  };
}