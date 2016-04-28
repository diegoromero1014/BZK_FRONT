module.exports = function(source) {
  this.cachable();
  return source.replace(/\};/g, "}");
};
