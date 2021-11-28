const CleanCSS = require('clean-css');
const { inExcludes } = require('./util');

module.exports = function(str, data) {
  const { css } = this.config.filter_optimize;
  if (inExcludes(data.path, css.excludes)) return str;
  return new CleanCSS({
    level: 2
  }).minify(str).styles;
};
