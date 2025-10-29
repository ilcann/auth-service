import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  // Health check endpoint for gateway or load balancers
  @Get('status')
  getStatus() {
    return { message: 'Auth Service is running' };
  }
}
