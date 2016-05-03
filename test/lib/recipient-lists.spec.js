'use strict';

let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let proxyquire = require('proxyquire').noCallThru();

chai.use(require('sinon-chai'));

describe('recipient-lists', function() {
  let body;
  let sparkpostMock;
  let sparkpostClient;
  let lib;

  beforeEach(function() {
    body = {
      results: {
        recipients: [{
          name: 'heisenberg',
          address: 'wwhite@jpwynnehs.gov'
        }]
      }
    };

    let response = {
      body: JSON.stringify(body)
    };

    sparkpostClient = {
      recipientLists: {
        find: sinon.stub().yields(null, response)
      }
    };

    sparkpostMock = sinon.stub().returns(sparkpostClient);

    lib = proxyquire('../../lib/recipient-lists', {
      'sparkpost': sparkpostMock
    });
  });

  describe('init', function() {

    it('should initialize the sparkpost client', function() {
      let apiKey = 'abc123';

      lib.init(apiKey);
      expect(sparkpostMock).to.have.been.calledWith(apiKey);
    });
  });

  describe('get', function() {

    beforeEach(function() {
      lib.init();
    });

    it('should get list and return recipients', function() {
      return lib.get('crystal-blue-persuasion')
        .then(result => {
          expect(sparkpostClient.recipientLists.find).to.have.been.calledWith({
            id: 'crystal-blue-persuasion',
            show_recipients: true
          });
          expect(result).to.deep.equal(body.results.recipients);
        });
    });

    it('should return an error if request fails', function() {
      let error = new Error('GUS FRING');

      sparkpostClient.recipientLists.find.yields(error);

      return lib.get('crystal-blue-persuasion')
        .then(() => {
          throw new Error('should have failed');
        })
        .catch(err => {
          expect(sparkpostClient.recipientLists.find).to.have.been.calledWith({
            id: 'crystal-blue-persuasion',
            show_recipients: true
          });
          expect(err).to.equal(error);
        });
    });
  });
});
