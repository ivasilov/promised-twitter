module.exports.show = function(params) {
  var path = "/statuses/show.json?id=" + params.id;
  return this.get(path, params);
};
