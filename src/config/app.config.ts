import { registerAs } from '@nestjs/config';

export interface AppConfig {
  env: string; // Örneğin 'development', 'production', 'test'
  port: number; // Uygulamanın çalışacağı port
  host: string; // Uygulamanın host adresi
  name: string; // Uygulama adı
}

export const appConfig = registerAs('app', (): AppConfig => {
  const port = parseInt(process.env.PORT ?? '5001', 10);
  const host = process.env.HOST || '0.0.0.0';
  const name = process.env.APP_NAME || 'Auth Service';
  const env = process.env.NODE_ENV || 'development';

  return {
    env,
    port,
    host,
    name,
  };
});
