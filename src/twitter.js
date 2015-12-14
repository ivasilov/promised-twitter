var twitterError = require('./error'),
    twit = require('twitter'),
    common =  require('./lib/common'),
    statuses =  require('./lib/statuses');


function Twitter(options) {
  options = options || {};
  this.options = {};
  this.options.test = options.test || false;
  delete options.test;
  this.client = new twit(options);

  this.statuses = {};
  for (var method in statuses) {
    this.statuses[method] = statuses[method].bind(this);
  }
}

Twitter.prototype.get = common.get;
Twitter.prototype.post = common.post;
Twitter.prototype.stream = common.stream;

module.exports = Twitter;
