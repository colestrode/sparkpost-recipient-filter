'use strict';

let recipFilter = module.exports;
let recipientLists = require('./recipient-lists');
let _ = require('lodash');

recipFilter.filter = (recipientListId, filterConfig) => {
  return recipientLists.get(recipientListId)
    .then(list => {
      return list;
    })
    .then(_.partial(filterByTags, filterConfig.tags))
    .then(_.partial(filterByMetadata, filterConfig.metadata))
    .then(_.partial(filterBySubstitutionData, filterConfig.substitution_data))
    .then(_.partial(filterByDomain, filterConfig.domain));
};

function filterByTags(tags, recipientList) {
  if (!tags) {
    return recipientList;
  }

  return _.filter(recipientList, recipient => {
    let commonTags = _.intersection(tags, recipient.tags);
    return commonTags.length === tags.length;
  });
}

function filterByMetadata(metadata, recipientList) {
  if (!metadata) {
    return recipientList;
  }

  return _.filter(recipientList, recipient => {
    return compareObjects(recipient.metadata, metadata);
  });
}

function filterBySubstitutionData(subData, recipientList) {
  if (!subData) {
    return recipientList;
  }

  return _.filter(recipientList, recipient => {
    return compareObjects(recipient.substitution_data, subData);
  });
}

function filterByDomain(domain, recipientList) {
  if (!domain) {
    return recipientList;
  }

  let email = recipient.address;
  if (typeof email === 'object') {
    email = recipient.address.email;
  }

  let recipDomain = email.split('@')[1];
  return domain === recipDomain;
}

function compareObjects(original, filter) {
  let merged = _.assign({}, original, filter);
  return _.isEqual(original, merged);
}