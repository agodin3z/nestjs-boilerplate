import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // ? SERVER
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().empty('').default(3000),
  ENABLE_DOCUMENTATION: Joi.boolean().empty('').default(false),
  ALLOWED_DOMAINS: Joi.string().empty('').default('localhost'),
});
