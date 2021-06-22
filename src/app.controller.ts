import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('file/upload')
  public uploadFile(@Req() req, @Res() res): any {
    return this.appService.saveFile(req)
      .then(path => res.send({ status: 'success', path }))
      .catch(err => res.send({ status: 'error', err }));
  }
}
