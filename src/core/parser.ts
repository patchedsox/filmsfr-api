import { Injectable } from 'injection-js';
import { IncomingMessage } from 'http';
import { Action } from 'goldengate24k';

@Injectable()
export class BodyParser {
  parse<T>(req: IncomingMessage): Promise<Action<T>> {
    return new Promise((resolve, reject) => {
      if (req.headers['Content-Type'] !== 'application/json'
        && req.headers['content-type'] !== 'application/json') {
        throw Error('Unsupported content type');
      }
      let body: Array<Buffer> = [];
      req.on('error', async (err) => {
        reject();
      }).on('data', function (chunk: Buffer) {
        body.push(chunk);
      }).on('end', async () => {
        let data = Buffer.concat(body).toString();
        let jsonData = JSON.parse(data);
        resolve(<Action<T>>jsonData);
      });
    });
  }
}