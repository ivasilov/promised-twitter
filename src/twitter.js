var twitterError = require('./error'),
    _ = require('lodash'),
    twit = require('twitter'),
    Promise = require('bluebird'),
    PromiseThrottle = require('promise-throttle');


var throttleOptions = {
  requestsPerSecond: 0.2,
  promiseImplementation: Promise
};

var throttle = new PromiseThrottle(throttleOptions);


function Twitter(options) {
  options = options || {};
  this.options = {};
  this.options.test = options.test || false;
  delete options.test;
  this.client = new twit(options);
}


var promisedGet = function(url, params) {
  var self = this;
  return new Promise(function(resolve, reject) {
    params = params || {};
    self.client.get(url, params, function(error, data, response) {
      if (error) {
        return reject(twitterError.process.call(this, error));
      } else {
        return resolve(data, response);
      }
    });
  });
};


Twitter.prototype.get = function(url, params) {
  if (this.options.test === true) {
    return promisedGet.call(this, url, params);
  } else {
    return throttle.add(promisedGet.bind(this, url, params));
  }
};


Twitter.prototype.show = function(params) {
  var path = "/statuses/show.json?id=" + params.id;
  return this.get(path, params);
};


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


Twitter.prototype.post = function(url, params) {
  return new Promise(function(resolve, reject) {
    params = params || {};
    this.client.post(url, params, function(error, data, response) {
      if (error) {
        return reject(error);
      } else {
        return resolve(data, response);
      }
    });
  });
};


Twitter.prototype.stream = function(url, params) {
  return new Promise(function(resolve, reject) {
    params = params || {};
    this.client.stream(url, params, function(error, data, response) {
      if (error) {
        return reject(error);
      } else {
        return resolve(data, response);
      }
    });
  });
};


module.exports = Twitter;
