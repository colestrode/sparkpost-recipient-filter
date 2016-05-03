# sparkpost-recipient-filter
[![Build Status](https://travis-ci.org/colestrode/sparkpost-recipient-filter.svg?branch=master)](https://travis-ci.org/colestrode/sparkpost-recipient-filter)
[![Coverage Status](https://coveralls.io/repos/github/colestrode/sparkpost-recipient-filter/badge.svg?branch=master)](https://coveralls.io/github/colestrode/sparkpost-recipient-filter?branch=master)

Filters a SparkPost recipient list by domains, tags, metadata and/or substitution data.

## Disclaimer

SparkPost is not a replacement for a marketing tool, if you need advanced subsetting of recipients
for your messaging, consider an Email Service Provider.

## Usage

This library exposes a `filter` method that returns a promise resolved with an array of recipient objects who match
the given criteria.

Your SparkPost API key will need `Recipient Lists: Read/Write` permissions.

NOTE: Works in Node v4.0.0 and up.

```js
let recipientFilter = require('sparkpost-recipient-filter')(process.env.SPARKPOST_API_KEY);

recipientFilter.filter('myListId', {
  domain: 'gmail.com',
  tags: ['super', 'cool'],
  metadata: {place: 'New York City'},
  substitution_data: {language: 'javascript'}
}).then(recipients => {
  // recipients is an array of SparkPost recipient objects
});

```

## Filtering

If multiple criteria are passed in the filter config, the match is performed using `AND` logic.
So if you pass both tags and a domain, only recipients with the given tags and at the given domain will be returned.

### Matching Tags

If a `tags` array is passed, all recipients who have all matching tags will be returned.
This is a strict subset match, so recipients must have all tags that are passed in the filter config
but may have more.

Example:

```js
// will find users with tags ['one', 'two'] but not ['one']
require('sparkpost-recipient-filter')(process.env.SPARKPOST_API_KEY)
  .filter('myListId', {tags: ['one', 'two']})
  .then(list => console.log(list))
  .catch(err => console.log(err));
```

### Matching Domain

If a `domain` is passed, returns recipients with the given email address domain.

Example:

```js
// will find users with @gmail.com email addresses
require('sparkpost-recipient-filter')(process.env.SPARKPOST_API_KEY)
  .filter('myListId', {domain: 'gmail.com'})
  .then(list => console.log(list))
  .catch(err => console.log(err));
```

### Matching Metadata and Substitution Data

Matches recipients who have the passed `metadata` and/or `substituition_data`. This is a strict subset match,
so recipients must have all values that are passed in, but may have more.

Array properties must have exactly the same elements in order to match.


Metadata example:

```js
// will find users with a location.city value of "NYC" AND a location.borough value of "Brooklyn"
require('sparkpost-recipient-filter')(process.env.SPARKPOST_API_KEY)
  .filter('myListId', {
    metadata: {
      location: {
        city: 'NYC',
        borough: 'Brooklyn'
      }
    }
  })
  .then(list => console.log(list))
  .catch(err => console.log(err));
```

Substitution data example:

```js
// will find users with a location.city value of "NYC" AND a locaiont.borough value of "Brooklyn"
require('sparkpost-recipient-filter')(process.env.SPARKPOST_API_KEY)
  .filter('myListId', {
    substitution_data: {
      location: {
        city: 'NYC',
        borough: 'Brooklyn'
      }
    }
  })
  .then(list => console.log(list))
  .catch(err => console.log(err));
```
