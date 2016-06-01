'use strict';
const Ajv = require('ajv'),
      restify = require('restify-errors');

const defaultErrorTransformer = (input, errors) => {
  let result = new restify.BadRequestError('Validation error');
  result.errors = errors;
  return result;
};

const defaultErrorResponder =  (transformedErr, req, res, next) => {
  return next(transformedErr);
};

const defaultKeysToValidate = ['params', 'body', 'query', 'user', 'headers', 'trailers'];
module.exports = function(options) {
  options = options || {};
  let ajvOptions = options.ajv || {
    v5: true,
    allErrors: true,
    useDefaults: true,
    coerceTypes: true
  };

  let errorTransformer = options.errorTransformer || defaultErrorTransformer;
  let errorResponder = options.errorResponder || defaultErrorResponder;
  let keysToValidate = options.keysToValidate || defaultKeysToValidate;

  let ajv = new Ajv(ajvOptions);
  return function restifyJoiMiddleware(req, res, next) {
    if (!req.route.hasOwnProperty('validation')) {
      return setImmediate(next);
    }

    let dataToValidate = keysToValidate
      .reduce((data, key) => {
        if (req.hasOwnProperty(key) /* && !ajvOptions.allowUnknown */) {
          data[key] = req[key] || {};
        }

        return data;
      }, {});

    let validation = req.route.validation;
    let validate = ajv.compile({
      type: 'object',
      properties: validation,
      required: Object.keys(validation)
    });

    let valid = validate(dataToValidate);
    if (!valid) {
      return errorResponder(errorTransformer(dataToValidate, validate.errors), req, res, next);
    }

    return next();
  };
};
