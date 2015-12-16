var _ = require('lodash'),
    Promise = require('bluebird');

module.exports.userTimeline = function(params) {
  return this.get("/statuses/user_timeline.json", params);
}

module.exports.show = function(params) {
  return this.get("/statuses/show.json", params);
};

module.exports.lookup = function(params) {
  var self = this;
  var ids = _.chunk(params.id, 100);

  return Promise.resolve(ids)
  .map(function(ids) {
    params.id = ids;
    return self.get("/statuses/lookup.json", params)
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
