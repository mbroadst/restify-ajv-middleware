'use strict';
const middleware = require('..'),
      expect = require('chai').expect;

describe('validation', function() {
  it('should error on invalid input', done => {
    const req = {
      params: {
        id: 'this-is-a-string'
      },
      route: {
        validation: {
          params: {
            type: 'object', properties: { id: { type: 'number' } }, required: [ 'id' ]
          }
        }
      }
    };

    middleware()(req, { send: done }, err => {
      expect(err).to.exist;
      expect(err.statusCode).to.eql(400, 'Error has a statusCode of 400');
      done();
    });
  });

  it('should allow valid input', done => {
    const req = {
      params: { id: 1 },
      route: {
        validation: {
          params: {
            type: 'object', properties: { id: { type: 'number' } }, required: [ 'id' ]
          }
        }
      }
    };

    middleware()(req, { send: done }, err => {
      expect(err).to.not.exist;
      done();
    });
  });

  it('should block on missing input', done => {
    // notice there's no req.params
    const req = {
      route: {
        validation: {
          params: {
            type: 'object', properties: { id: { type: 'number' } }, required: [ 'id' ]
          }
        }
      }
    };

    middleware()(req, { send: done }, err => {
      expect(err).to.exist;
      expect(err.statusCode).to.eql(400, 'Error has a statusCode of 400');
      done();
    });
  });
});
