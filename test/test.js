var Twitter = require("../lib/twitter.js"),
    error = require("../lib/error.js"),
    Promise = require('bluebird'),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised");

chai.should();
chai.use(chaiAsPromised);
global.assert = chai.assert;
global.expect = chai.expect;

config = {
  "consumer_key":        process.env.CONSUMER_KEY,
  "consumer_secret":     process.env.CONSUMER_SECRET,
  "access_token_key":    process.env.ACCESS_TOKEN_KEY,
  "access_token_secret": process.env.ACCESS_TOKEN_SECRET
};

describe("Initializing Twitter lib", function() {
  var twit = {};

  before(function() {
    twit = new Twitter();
  });

  it("Invalid token when not initialized properly", function() {
    return twit.get("/statuses/show/noURL.json").should.eventually.be.rejectedWith(error.InvalidTokenError);
  });
});
