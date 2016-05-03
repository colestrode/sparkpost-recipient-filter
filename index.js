'use strict';

let recipientLists = require('./lib/recipient-lists');
let recipientFilter = require('./lib/filter');

module.exports = function(apiKey) {
  if (!apiKey) {
    throw new Error('A SparkPost API key is required.');
  }

  recipientLists.init(apiKey);
  return recipientFilter;
};
