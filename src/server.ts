import { Injectable } from 'injection-js';
import { Logger } from 'core/logger';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { BodyParser } from 'core/parser';
import { RequestBody, ResponseBody } from 'goldengate24k';
import { Router } from 'core/router';
import { HttpResponse } from 'goldengate24k/src';

const exposeHeaders = ['cache-control', 'content-language', 'content-type', 'expires', 'last-modified', 'pragma'];

const allowHeaders = [
  // 'Access-Control-Request-Method',
  // 'Access-Control-Request-Headers',
  // 'Access-Control-Allow-Headers',
  // 'Origin',

  'X-Requested-With',
  'X-Access-Token',

  'accept',
  'accept-language',
  'content-language',
  'content-type'
];

@Injectable()
export class HttpServer {
  constructor(private logger: Logger, private bodyParser: BodyParser, private router: Router) { }

  start() {
    let server = new Server(this.handler.bind(this));
    server.listen(process.env.APP_HTTP_PORT, () =>
      this.logger.trace(`Server is listening on ${process.env.APP_HTTP_PORT}`)
    );
    process.on('uncaughtException', (err: Error) => this.logger.trace('Unhandled exception occurred', err));
  }

  private handler(req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'HEAD,POST,GET');
    res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.setHeader('Access-Control-Expose-Headers', exposeHeaders.join(', '));
    // res.setHeader('Strict-Transport-Security', ['max-age=31536000', 'includeSubDomains', 'preload']);
    res.setHeader('Cache-Control', ['no-cache', 'no-store', 'must-revalidate']);
    // res.setHeader('Pragma', 'no-cache');
    // res.setHeader('X-XSS-Protection', ['1', 'mode=block']);
    // res.setHeader('X-Content-Type-Options', 'nosniff');
    // res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    // res.setHeader('Expires', '-1');
    // res.setHeader('Content-Security-Policy', 'script-src \'self\'');
    switch (req.method) {
      case 'OPTIONS':
        res.writeHead(204);
        res.end();
        return;
      case 'POST':
        this.bodyParser
          .parse<RequestBody>(req)
          .then(jsonResult => {
            this.router.route(jsonResult).then((result) => {
              res.setHeader('Content-Type', 'application/json');
              res.writeHead(200);
              res.end(JSON.stringify(<HttpResponse<ResponseBody>>{
                body: result,
                status: 200
              }));
            });
          });
        return;
      case 'GET':
        res.end('Hello world');
        return;
      default:
    }
  }
}
