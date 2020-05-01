const score = require('./score');

module.exports = function(...args) {
  return score(...args).total;
};
