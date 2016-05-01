'use strict';

let recipientLists = module.exports;
let Sparkpost = require('sparkpost');
let q = require('q');
let findList;

recipientLists.init = (apiKey) => {
  let client = new Sparkpost(apiKey);

  findList = q.nbind(client.recipientLists.find, client.recipientLists);
};

recipientLists.get = (recipientListId) => {
  return findList({
    id: recipientListId,
    show_recipients: true
  }).then(res => {
    return JSON.parse(res.body).results.recipients;
  });
};
