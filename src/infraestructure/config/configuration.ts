export const configuration = (): configurationType => ({
  // ? SERVER
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT || '3000', 10),
  ENABLE_DOCUMENTATION: process.env.ENABLE_DOCUMENTATION === 'true',
  ALLOWED_DOMAINS: process.env.ALLOWED_DOMAINS,
});

type configurationType = {
  NODE_ENV: string;
  PORT: number;
  ENABLE_DOCUMENTATION: boolean;
  ALLOWED_DOMAINS: string;
};
