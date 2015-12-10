var Twitter = require("../src/twitter.js"),
    error = require("../src/error.js"),
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
  var params = {};
  params.id = [
    '671198175668080640', '671198185541496832', '671197728379158528', '671197743855996929', '671197749975638016', '671197743273091072',
    '671197763225436160', '671197800680529920', '671197833836560384', '671197792518324226', '671197812944596993', '671197845840650240',
    '671197888815472640', '671197958562557952', '671197881575989248', '671197744409767936', '671197765297246209', '671197793491542016',
    '671197834125959168', '671332543212466176', '671197859031699456', '671331891103080449', '671197900140072960', '671330108246896640',
    '671197907043807232', '671329661943582720', '671197792656891904', '671327543539073024', '671197936382951425', '671316391375556609',
    '671197808540540929', '671313331601346561', '671197899447918593', '671305371386966016', '671197840266403840', '671298661125660673',
    '671197868909309952', '671294759395131392', '671197823623372801', '671292385045823488', '671197863548948480', '671197883522269185',
    '671264100987641856', '671197963142610944', '671197885451530240', '671216339499921410', '671197934562578433', '671216469544407040',
    '671197983166373888', '671192297216831488', '671198007367483392', '671192017393737728', '671197998899073024', '671192013820178432',
    '671198002887786497', '671191934464098309', '671198003844112384', '671198004079034368', '671198007124058114', '671198020269051905',
    '671198026392690688', '671198032021446657', '671198011008098304', '671198032646561793', '671198040611553280', '671198010328518656',
    '671198023712509952', '671198030767386624', '671198047418773506', '671198087604387840', '671198089462554624', '671197994247680000',
    '671198015135334400', '671198028766814210', '671198047087550464', '671198064489705472', '671198088653066240', '671198081988370432',
    '671198085754830848', '671198048874201088', '671198050501591040', '671198057103425537', '671198063898271748', '671198075885477888',
    '671198089022070784', '671198082068029440', '671198104834564096', '671198171553370113', '671198097121394688', '671198180982317057',
    '671201903481479168', '671201498940985344', '671201727115235328', '671198268710256640', '671201242752921600', '671198272283787265',
    '671201237438742528', '671198311911694336', '671200792272084992', '671198285919555584' ];

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

  it("Test show API with 1 tweet", function() {
    var promise = twit.show({id: "672950780727533568"});
    return Promise.all([
      promise.should.eventually.have.property('text', 'Test tweet for my awesome node.js lib :).'),
      promise.should.eventually.be.fulfilled
    ]);
  });

  it("Test lookup API with 100 ids of tweets", function() {
    promise = twit.lookup(params);
    return Promise.all([
      promise.should.eventually.be.fulfilled,
      promise.should.eventually.have.property('data'),
      promise.should.eventually.have.property('errors')
    ]);
  });
});
