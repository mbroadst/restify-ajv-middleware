'use strict';
const restify = require('restify-errors'),
      middleware = require('../'),
      expect = require('chai').expect;

describe('options', function() {
  describe('errorTransformer', function() {
    it('should transforms errors', done => {
      const transformer = (input, error) => {
        return new restify.BadRequestError('Test');
      };

      const req = {
        params: { id: 'test' },
        route: {
          validation: {
            params: { type: 'object', properties: { id: { type: 'number' } }, required: [ 'id' ] }
          }
        }
      };

      middleware({ errorTransformer: transformer })(req, { send: done }, err => {
        expect(err).to.exist;
        expect(err.message).to.eql('Test');
        done();
      });
    });
  });

  describe('errorResponder', function() {
    it('should alter how the middleware responds to errors', done => {
      const responder = (transformedErr, req, res, next) => {
        res.send(200, 'Test');
        return next();
      };

      const req = {
        params: { id: 'test' },
        route: {
          validation: {
            params: { type: 'object', properties: { id: { type: 'number' } }, required: [ 'id' ] }
          }
        }
      };

      middleware({ errorResponder: responder })(req, {
        send: (code, body) => {
          expect(code).to.equal(200);
          expect(body).to.eql('Test');
          done();
        }
      }, err => {
        expect(err).to.not.exist;
      });
    });
  });

  describe('ajv', function() {
    it('should remove additional values', done => {
      const req = {
        params: { id: 1, name: 'Test' },
        route: {
          validation: {
            params: {
              type: 'object',
              properties: { id: { type: 'number' } },
              required: [ 'id' ],
              additionalProperties: false
            }
          }
        }
      };

      middleware({ ajv: { removeAdditional: true } })(req, { send: done }, err => {
        expect(err).to.not.exist;
        expect(req.params).to.not.have.keys('name');
        done();
      });
    });
  });
});
