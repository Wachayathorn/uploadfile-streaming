import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AppService {
  public async saveFile(req) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, `/image.mp4`);
      const stream = fs.createWriteStream(filePath);

      stream.on('open', () => {
        console.log('Stream open ...  0.00%');
        req.pipe(stream);
      });

      stream.on('drain', () => {
        const written = Number(stream.bytesWritten);
        const total = Number(req.headers['content-length']);
        const pWritten = ((written / total) * 100).toFixed(2);
        console.log(`Processing  ...  ${pWritten}% done`);
      });

      stream.on('close', () => {
        console.log('Processing  ...  100%');
        resolve(filePath);
      });

      stream.on('error', err => {
        console.error(err);
        reject(err);
      });
    });
  }
}
