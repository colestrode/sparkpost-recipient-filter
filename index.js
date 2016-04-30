'use strict';

let recipientLists = require('./lib/recipient-lists');
let recipientFilter = require('./lib/filter');

module.exports = function(apiKey) {
  recipientLists.init(apiKey);
  return recipientFilter;
};