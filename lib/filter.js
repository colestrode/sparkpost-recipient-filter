'use strict';

let recipFilter = module.exports;
let recipientLists = require('./recipient-lists');
let _ = require('lodash');

recipFilter.filter = (recipientListId, filterConfig) => {
  return recipientLists.get(recipientListId)
    .then(_.partial(filterByTags, filterConfig.tags))
    .then(_.partial(filterByMetadata, filterConfig.metadata))
    .then(_.partial(filterBySubstitutionData, filterConfig.substitution_data))
    .then(_.partial(filterByDomain, filterConfig.domain));
};

function filterByTags(tags, recipientList) {
  return filterList(tags, recipientList, recipient => {
    let commonTags = _.intersection(tags, recipient.tags);

    return commonTags.length === tags.length;
  });
}

function filterByMetadata(metadata, recipientList) {
  return filterList(metadata, recipientList, recipient => {
    return includesObject(recipient.metadata, metadata);
  });
}

function filterBySubstitutionData(subData, recipientList) {
  return filterList(subData, recipientList, recipient => {
    return includesObject(recipient.substitution_data, subData);
  });
}

function filterByDomain(domain, recipientList) {
  return filterList(domain, recipientList, recipient => {
    let email = recipient.address;

    if (typeof email === 'object') {
      email = recipient.address.email;
    }

    let recipDomain = email.split('@')[1];

    return domain === recipDomain;
  });
}

function filterList(filterConfig, recipientList, filterCb) {
  if (!filterConfig) {
    return recipientList;
  }

  return _.filter(recipientList, filterCb);
}

function includesObject(full, partial) {
  let merged = _.merge({}, full, partial);

  return _.isEqual(full, merged);
}
