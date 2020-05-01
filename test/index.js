'use strict';

var assert = require('assert');
var mimeScore = require('../index.js');

describe('mime-score', function() {
  it('Scores', function() {
    assert.equal(mimeScore('image/bmp', 'iana'), 940.91)
    assert.equal(mimeScore('application/x-foo'), 231.83)
    assert.equal(mimeScore('font/x.foo', 'apache'), 322.90)
    assert.equal(mimeScore('text/vnd.foo', 'nginx'), 410.88)
    assert.equal(mimeScore('text/prs.foo', 'nginx'), 110.88)
  });
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
    assert(mimeScore('text/wat') > mimeScore('text/water'))
  });
});
