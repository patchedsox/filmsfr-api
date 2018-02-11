
declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT_PATH: string;
    APP_HTTP_PORT: string;
    APP_MAP_BOX_KEY: string;
  }
  export interface Process {
    env: ProcessEnv;
  }
}