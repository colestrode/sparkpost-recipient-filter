'use strict';

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let proxyquire = require('proxyquire').noCallThru();

chai.use(require('sinon-chai'));
require('sinon-as-promised');

describe('filter', function() {
  let recipientListsMock;
  let lib;

  beforeEach(function() {
    recipientListsMock = {
      get: sinon.stub().resolves([])
    };

    lib = proxyquire('../../lib/filter', {
      './recipient-lists': recipientListsMock
    });
  });

  it('should filter by nothing', function() {
    let recipient = {
      email: {
        address: 'wwhite@jpwynnehs.gov'
      }
    };

    recipientListsMock.get.resolves([recipient]);

    return lib.filter('myList')
      .then(result => {
        expect(result).to.deep.equal([recipient]);
      });
  });

  it('should filter with an empty config', function() {
    let recipient = {
      email: {
        address: 'wwhite@jpwynnehs.gov'
      }
    };

    recipientListsMock.get.resolves([recipient]);

    return lib.filter('myList', {})
      .then(result => {
        expect(result).to.deep.equal([recipient]);
      });
  });

  it('should filter by tags', function() {
    let recipient = {
      tags: ['heisenberg', 'AMC']
    };

    recipientListsMock.get.resolves([
      recipient,
      {
        tags: ['capncook', 'AMC']
      }
    ]);

    return lib.filter('myList', {tags: ['heisenberg', 'AMC']})
      .then(result => {
        expect(result).to.deep.equal([recipient]);
      });
  });

  it('should filter by metadata', function() {
    let recipient = {
      metadata: {
        shallow: true,
        deep: {
          property: true
        }
      }
    };

    recipientListsMock.get.resolves([
      recipient,
      {
        metadata: {
          property: 'damage',
          deep: {
            property: false
          }
        }
      }
    ]);

    return lib.filter('myList', {metadata: {deep: {property: true}}})
      .then(result => {
        expect(result).to.deep.equal([recipient]);
      });
  });

  it('should filter by substitution data', function() {
    let recipient = {
      substitution_data: {
        shallow: true,
        deep: {
          property: true
        }
      }
    };

    recipientListsMock.get.resolves([
      recipient,
      {
        substitution_data: {
          property: 'damage',
          deep: {
            property: false
          }
        }
      }
    ]);

    return lib.filter('myList', {substitution_data: {deep: {property: true}}})
      .then(result => {
        expect(result).to.deep.equal([recipient]);
      });
  });

  it('should filter by domain', function() {
    let recipient = {
      address: {
        email: 'wwhite@jpwynnehs.gov'
      }
    };

    recipientListsMock.get.resolves([
      recipient,
      {
        address: {
          email: 'jessepinkmaniscool@aol.com'
        }
      }
    ]);

    return lib.filter('myList', {domain: 'jpwynnehs.gov'})
      .then(result => {
        expect(result).to.deep.equal([recipient]);
      });
  });

  it('should filter by domain if email is a string', function() {
    let recipient = {
      address: 'wwhite@jpwynnehs.gov'
    };

    recipientListsMock.get.resolves([
      recipient,
      {
        address: 'jessepinkmaniscool@aol.com'
      },
      {
        address: {
          email: 'jessepinkmaniscool@aol.com'
        }
      }
    ]);

    return lib.filter('myList', {domain: 'jpwynnehs.gov'})
      .then(result => {
        expect(result).to.deep.equal([recipient]);
      });
  });

  it('should throw an error if recipient listId is missing', function() {
    return lib.filter()
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err => {
        expect(err.message).to.equal('recipientListId is required');
      });
  });

  it('should throw an error if recipient listId is not a string', function() {
    return lib.filter({})
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err => {
        expect(err.message).to.equal('recipientListId is required');
      });
  });

  it('should return an error if getting the recipient list fails', function() {
    let error = new Error('GUS FRING');

    recipientListsMock.get.rejects(error);

    return lib.filter('myList', {})
      .then(() => {
        throw new Error('should have failed');
      })
      .catch(err => {
        expect(err).to.equal(error);
      });
  });
});
