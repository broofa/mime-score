import assert from 'assert';
import mimeScore from './mimeScore.js';
it('Misc. scores', function () {
    assert.equal(mimeScore('image/bmp', 'iana'), 940.91);
    assert.equal(mimeScore('application/x-foo'), 231.83);
    assert.equal(mimeScore('font/x.foo', 'apache'), 322.9);
    assert.equal(mimeScore('text/vnd.foo', 'nginx'), 410.88);
    assert.equal(mimeScore('text/prs.foo', 'nginx'), 110.88);
});
it('Facet priority', function () {
    assert(mimeScore('image/bmp') > mimeScore('image/x-ms-bmp'));
});
it('Source priority', function () {
    assert.equal(mimeScore('image/bmp', 'iana'), 940.91);
    assert.equal(mimeScore('image/bmp'), 930.91);
    assert.equal(mimeScore('image/bmp', 'apache'), 920.91);
    assert.equal(mimeScore('image/bmp', 'nginx'), 910.91);
});
it('General type priority', function () {
    assert.equal(mimeScore('application/xml'), 931.85);
    assert.equal(mimeScore('text/xml'), 930.92);
});
it('Length priority', function () {
    assert.equal(mimeScore('text/wat'), 930.92);
    assert.equal(mimeScore('text/water'), 930.9);
});
