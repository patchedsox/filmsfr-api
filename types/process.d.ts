
declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT_PATH: string;
    APP_HTTP_PORT: string;
    APP_GOOGLE_MAPS_KEY: string;
  }
  export interface Process {
    env: ProcessEnv;
  }
}