var Twitter = require("../lib/twitter.js"),
    error = require("../lib/error.js"),
    Promise = require('bluebird'),
    chai = require("chai"),
    chaiAsPromised = require("chai-as-promised");

if (!process.env.TRAVIS) require('dotenv').load();

chai.should();
chai.use(chaiAsPromised);
global.assert = chai.assert;
global.expect = chai.expect;

config = {
  "consumer_key":        process.env.CONSUMER_KEY,
  "consumer_secret":     process.env.CONSUMER_SECRET,
  "access_token_key":    process.env.ACCESS_TOKEN_KEY,
  "access_token_secret": process.env.ACCESS_TOKEN_SECRET,
  test:                  true
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


describe("Testing Twitter methods", function() {
  var twit = {};

  before(function() {
    twit = new Twitter(config);
  });

  it("Test the get method with the show API for a specific tweet", function() {
    var promise = twit.get("/statuses/show/672950780727533568.json");
    return Promise.all([
      promise.should.eventually.have.property('text', 'Test tweet for my awesome node.js lib :).'),
      promise.should.eventually.be.fulfilled
    ]);
  });
});
