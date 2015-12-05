var twitterError = require('./error'),
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
