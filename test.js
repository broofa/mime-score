'use strict';

var assert = require('assert');
var mimeScore = require('.');

const TYPES = {
  'application/x-tar': 0,
  'application/x-tar': 0,
};

describe('mime-score', function() {
  it('Facet priority', function() {
    assert(mimeScore('image/bmp') > mimeScore('image/x-ms-bmp'))
  });

  it('Source priority', function() {
    assert(mimeScore('image/bmp', 'iana') > mimeScore('image/bmp'))
    assert(mimeScore('image/bmp') > mimeScore('image/bmp', 'apache'))
    assert(mimeScore('image/bmp', 'apache') > mimeScore('image/bmp', 'nginx'))
  });

  it('General type priority', function() {
    assert(mimeScore('application/xml') > mimeScore('text/xml'))
  });

  it('Length priority', function() {
    assert(mimeScore('text/wat') > mimeScore('image/wat'))
  });
});
