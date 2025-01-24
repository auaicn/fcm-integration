import { Body, Controller, Post } from '@nestjs/common';

@Controller('bg-log')
export class BgLogController {
  @Post()
  async log(@Body() body: { message: string }) {
    console.log(body.message);

    return { message: 'Request logged successfully' };
  }
}
