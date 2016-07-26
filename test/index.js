"use strict";

const tap = require('tap');
const nock = require('nock');
const fetch = require('../index.js');

tap.test('emits metric for pageload', t => {
  nock('http://example.org')
    .get('/')
    .reply(200, 'ohai');

  let foundMetric = false;
  process.on('metric', metric => {

    if (metric.name === 'latency.external') {
      t.equal(metric.source, 'example.org');
      foundMetric = true;
    }
    
  });

  return fetch('http://example.org')
    .then(res => res.text())
    .then(body => {
      t.equal(body, 'ohai');
      t.ok(foundMetric);
    });
});
