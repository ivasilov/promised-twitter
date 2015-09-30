'use strict'

var _ = require("lodash")


module.exports.process = function(error) {
  if (_.isEqual(error, [{ message: 'Rate limit exceeded', code: 88 }])) {
    return new LimitExceededError()
  } else if (_.isEqual(error, [{ message: 'Sorry, that page does not exist', code: 34 }])) {
    return new DoesNotExistError(error[0])
  } else {
    return error
  }
}


var inherits = function(SubClass, SuperClass) {
  if (SuperClass.constructor === Function) {
    // Normal Inheritance
    SubClass.prototype = new SuperClass()
    SubClass.prototype.constructor = SubClass
    SubClass.prototype.parent = SuperClass.prototype
  } else {
    // Pure Virtual Inheritance
    SubClass.prototype = SuperClass
    SubClass.prototype.constructor = SubClass
    SubClass.prototype.parent = SuperClass
  }

  return SubClass;
}


var BaseError = function() {
  var tmp = Error.apply(this, arguments)
  tmp.name = this.name = 'TwitterBaseError'

  this.message = tmp.message
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, this.constructor)
}
inherits(BaseError, Error)


var LimitExceededError = function (parent) {
  BaseError.apply(this, [parent.message])
  this.name = 'TwitterLimitExceededError'
}
inherits(LimitExceededError, BaseError)


var DoesNotExistError = function (parent) {
  BaseError.apply(this, [parent.message])
  this.name = 'TwitterDoesNotExistError'
}
inherits(DoesNotExistError, BaseError)
