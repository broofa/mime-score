#!/usr/bin/env node
import mimeScore from './mimeScore.js';
const [, , type, source] = process.argv;
const score = mimeScore(type, source);
console.log(score);
