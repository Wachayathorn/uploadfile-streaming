import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('file')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('upload')
  public uploadFile(@Req() req, @Res() res) {
    return this.appService.saveFile(req)
      .then(path => res.send({ status: 'success', path }))
      .catch(err => res.send({ status: 'error', err }));
  }

  @Get('streaming-video/:name')
  public downloadFile(@Param('name') name: string, @Req() req, @Res() res) {
    const filePath = path.join(__dirname, `/${name}`);
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(filePath, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(filePath).pipe(res)
    }
  }
}
