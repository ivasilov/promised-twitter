var twit = require("twitter"),
    Promise = require('bluebird'),
    PromiseThrottle = require('promise-throttle')

var throttleOptions = {
  requestsPerSecond: 0.2,
  promiseImplementation: Promise
}

var throttle = new PromiseThrottle(throttleOptions)

var TwitterError = function(message) {
  this.name = "TwitterError"
  this.message = message || "Error while fetching from Twitter."
  this.stack = (new Error()).stack
}

TwitterError.prototype = Object.create(Error.prototype)
TwitterError.prototype.constructor = TwitterError

deriveError = function(result) {
  if (result && result[0] && result[0].message) {
    return new TwitterError(result[0].message)
  } else {
    return new TwitterError()
  }
}


function Twitter(options) {
  this.client = new twit(options)
}


var promisedGet = function(url, params) {
  var self = this
  return new Promise(function(resolve, reject) {
    if (typeof params === 'undefined') { params = {} }
    self.client.get(url, params, function(error, data, response) {
      if (error) {
        return reject(deriveError(error))
      } else {
        return resolve(data, response)
      }
    })
  })
}


Twitter.prototype.get = function(url, params) {
  return throttle.add(promisedGet.bind(this, url, params))
}


Twitter.prototype.post = function(url, params) {
  return new Promise(function(resolve, reject) {
    if (typeof params === 'undefined') { params = {} }
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
    if (typeof params === 'undefined') { params = {} }
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
