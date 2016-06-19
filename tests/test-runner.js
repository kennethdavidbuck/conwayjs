"use strict";

var testrunner = require('qunit');

testrunner.run({
  code: { path: `${__dirname}/../src/index.js`, namespace: 'Conway' },
  tests: `${__dirname}/conway-test.js`
}, function (error) {
  if(error) {
    console.log(error);
  }
});
