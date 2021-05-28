import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import camelCase from 'lodash/camelCase';
import { logger } from './logger';

export class IllegalArgumentException extends Error {
  constructor(obj = {}) {
    const message = Object.keys(obj).reduce((acc, key) => {
      if (!obj[key]) {
        return `${acc} ${key},`;
      }
      return acc;
    }, 'Empty fields:');
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationErrorBuilder {
  constructor(ctx) {
    this.ctx = ctx;
    this.errors = {};
  }

  add(field, message) {
    const messages = this.errors[field];

    if (!messages) {
      this.errors[field] = [message];
    } else {
      this.errors[field] = [...messages, message];
    }

    return this;
  }

  hasErrors() {
    return !isEmpty(this.errors);
  }

  build() {
    if (isEmpty(this.errors)) {
      return null;
    }

    return {
      status: 'error',
      errors: {
        ...this.errors,
      },
    };
  }

  sendError() {
    this.ctx.send(422, this.build());
  }
}

export const checkRequiredArguments = (args) => {
  if (Object.keys(args).find((key) => !args[key])) {
    throw new IllegalArgumentException(args);
  }
};

export const camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

const _processValidationResult = async (validation, next) => {
  if (validation.hasErrors()) {
    validation.sendError();
  } else {
    await next();
  }
};

export const validate = (validators) => async (ctx, next) => {
  const _validators = Array.isArray(validators) ? validators : [validators];
  const errors = new ValidationErrorBuilder(ctx);
  for (let validator of _validators) {
    await validator.call(this, errors, ctx, next);
  }
  await _processValidationResult(errors, next);
};

// eslint-disable-next-line no-unused-vars
export const validateEnum = (field, values) => async (errors, ctx, next) => {
  const val = ctx.request.body[field];
  logger.debug(`Validating enum ${field}=${val}`, ctx.request.body);
  if (!includes(values, val)) {
    errors.add(field, `Must be one of ${values}`);
  }
};

// eslint-disable-next-line no-unused-vars
export const validateRequired = (requiredFields) => async (
  errors,
  ctx,
  next,
) => {
  const data = ctx.request.body;
  (requiredFields || []).forEach((field) => {
    const value = data[field];
    if (value === undefined || value === null) {
      errors.add(field, 'Mandatory field');
    }
  });
};
