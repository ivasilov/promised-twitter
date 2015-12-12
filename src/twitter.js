var twitterError = require('./error'),
    _ = require('lodash'),
    twit = require('twitter'),
    Promise = require('bluebird'),
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

Twitter.prototype.lookup = function(params) {
  var self = this;
  var ids = _.chunk(params.id, 100);
  delete params.id;

  return Promise.resolve(ids)
  .map(function(ids) {
    var path = "/statuses/lookup.json?id=" + ids;
    return self.get(path, params)
    .then(function(res) {return { data: res };})
    .catch(function(e)  {return { error: e };});
  }).reduce(function(obj, res) {
    if (res.data) {
      obj.data.push(res.data);
    }
    if (res.error) {
      obj.errors.push(res.error);
    }
    return obj;
  }, {data: [], errors: []})
  .then(function(result) {
    result.data = _.flatten(result.data);
    result.errors = _.flatten(result.errors);
    return result;
  });
};

module.exports = Twitter;
