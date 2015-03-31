var twit = require("twitter"),
    Promise = require('bluebird'),
    PromiseThrottle = require('promise-throttle')

var throttleOptions = {
  requestsPerSecond: 0.2,
  promiseImplementation: Promise
}

var throttle = new PromiseThrottle(throttleOptions)


function Twitter(options) {
  var client = new Twitter(options)
}


var promisedGet = function(url, params) {
  return new Promise(function(resolve, reject) {
    this.client.get(url, params, function(error, data, response) {
      if (error) {
        return reject(error)
      } else {
        return resolve(data, response)
      }
    })
  })
}


Twitter.prototype.get = function(url, params) {
  throttle.add(promisedGet(url, params))
}


Twitter.prototype.post = function(url, params) {
  return new Promise(function(resolve, reject) {
    this.client.post(url, params, function(error, data, response) {
      if (error) {
        return reject(error)
      } else {
        return resolve(data, response)
      }
    })
  })
}


Twitter.prototype.stream = function(url, params) {
  return new Promise(function(resolve, reject) {
    this.client.stream(url, params, function(error, data, response) {
      if (error) {
        return reject(error)
      } else {
        return resolve(data, response)
      }
    })
  })
}

module.exports = Twitter
