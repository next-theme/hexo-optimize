const CleanCSS = require('clean-css');
const { inExcludes } = require('./util');

module.exports = function(str, data) {
  const { excludes } = this.config.filter_optimize.css;
  if (inExcludes(data.path, excludes)) return str;
  return new CleanCSS({
    level: 2
  }).minify(str).styles;
};
