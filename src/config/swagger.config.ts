import { registerAs } from '@nestjs/config';

export interface SwaggerConfig {
  isEnabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
  bearerName: string;
}

export const swaggerConfig = registerAs('swagger', (): SwaggerConfig => {
  const isEnabled = process.env.SWAGGER_ENABLED === 'true' || true;
  const title = process.env.SWAGGER_TITLE || 'Auth Service API Documentation';
  const description =
    process.env.SWAGGER_DESCRIPTION || 'Auth Service API Documentation';
  const version = process.env.SWAGGER_VERSION || '1.0';
  const path = process.env.SWAGGER_PATH || '/docs';
  const bearerName = 'accessToken';

  return {
    isEnabled,
    title,
    description,
    version,
    path,
    bearerName,
  };
});
