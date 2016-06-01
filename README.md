# restify-ajv-middleware
[![Build Status](https://travis-ci.org/mbroadst/restify-ajv-middleware.svg?branch=master)](https://travis-ci.org/mbroadst/restify-ajv-middleware)
[![Test Coverage](https://codeclimate.com/github/mbroadst/restify-ajv-middleware/badges/coverage.svg)](https://codeclimate.com/github/mbroadst/restify-ajv-middleware/coverage)

A [json-schema](json-schema.org) validation middleware for restify using [ajv](https://github.com/epoberezkin/ajv). Inspired by [restify-joi-middleware](https://github.com/maxnachlinger/restify-joi-middleware)

### Installation
```
npm install restify-ajv-middleware --save
```

### Usage
```javascript
const restify = require('restify')
const validator = require('restify-ajv-middleware')
const server = restify.createServer()

server.use(validator(/* options */))

server.get({
  path: '/:id',
  validation: {
    params: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: [ 'id' ],
      additionalProperties: false
    }
  }
}, (req, res) => {
  return res.send(200, { id: req.params.id })
});
```

### Options
- _keysToValidate_: override the default keys to validate against
```javascript
server.use(validator({
  // changes the request keys validated
  keysToValidate: ['params', 'body', 'query', 'user', 'headers', 'trailers'],
});
```
- _errorResponder_: a function in the form `(transformedErr, req, res, next)` used to modify the default response strategy after failed validation.
```javascript
server.use(validator({
  // changes how errors are returned
  errorResponder: (transformedErr, req, res, next) => {
    res.send(400, transformedErr)
    return next()
  }
});
```
- _errorTransformer_: a function in the form `(validationInput, errors)`, used to transform the error generated after failed validation
```javascript
server.use(validator({
  // changes how json-schema errors are transformed
  errorTransformer: (validationInput, errors) => new restifyErrors.BadRequestError('Something else'),
});
```
- _ajv_: options passed to the internal ajv instance. See [options](https://github.com/epoberezkin/ajv#options) for more info.
