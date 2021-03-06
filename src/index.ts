require('source-map-support').install();
require('app-module-path').addPath(__dirname + '/');
import 'reflect-metadata';
import { Startup } from './startup';
const startup = new Startup();

startup
  .configure()
  .bootstrap()
  .run();

process.stdin.read();