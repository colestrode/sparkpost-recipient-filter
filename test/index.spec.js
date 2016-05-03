'use strict';

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let proxyquire = require('proxyquire').noCallThru();

chai.use(require('sinon-chai'));

describe('Index', function() {
  let recipientListsMock;
  let filterMock;
  let lib;

  beforeEach(function() {
    recipientListsMock = {
      init: sinon.stub()
    };

    filterMock = {
      filter: sinon.stub()
    };

    lib = proxyquire('../index', {
      './lib/recipient-lists': recipientListsMock,
      './lib/filter': filterMock
    });
  });

  it('should intialize the recipient list lib and export a filter', function() {
    let apiKey = 'abc123';
    let exported = lib(apiKey);

    expect(recipientListsMock.init).to.have.been.calledWith(apiKey);
    expect(exported.filter).to.equal(filterMock.filter);
  });
});
