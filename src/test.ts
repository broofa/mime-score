import assert from 'assert';
import { it } from 'node:test';
import mimeScore from './mimeScore.js';

const SCORES: [string[], number][] = [
  // Source scores
  [['image/bmp', 'iana'], 940.91],
  [['image/bmp'], 930.91],
  [['image/bmp', 'apache'], 920.91],
  [['image/bmp', 'nginx'], 910.91],

  // Misc. scores and sources
  [['application/javascript'], 931.78],
  [['application/mp4'], 931.85],
  [['application/x-foo'], 231.83],
  [['application/xml'], 931.85],
  [['font/x.foo', 'apache'], 322.9],
  [['text/javascript'], 930.85],
  [['text/prs.foo', 'nginx'], 110.88],
  [['text/vnd.foo', 'nginx'], 410.88],
  [['text/xml'], 930.92],
  [['video/mp4'], 933.91],

  // Facet score check
  [['image/bmp', 'iana'], 940.91],
  [['image/x-ms-bmp'], 230.86],

  // Scores based on string length
  [['text/wat'], 930.92],
  [['text/water'], 930.9],
];

it('Scores', function () {
  for (const [args, expected] of SCORES) {
    assert.equal(mimeScore(args[0], args[1]), expected, args.join(', '));
  }
});

it('Checks', function () {
  assert(
    mimeScore('image/bmp') > mimeScore('image/x-ms-bmp'),
    'experimental score must be lower than official'
  );

  assert(
    mimeScore('text/javascript', 'iana') >
      mimeScore('application/javascript', 'apache'),
    'iana score must be higher than apache (JS type!)'
  );
});
