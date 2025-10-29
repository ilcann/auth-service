import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

export const refreshCookie = {
  set: (res: Response, token: string, configService: ConfigService) => {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: configService.get<number>('jwt.refreshExpiresInMs'),
    });
  },

  clear: (res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  },
};
