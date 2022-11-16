const css = require('lightningcss');
const { inExcludes } = require('./util');

module.exports = function(str, data) {
  const { excludes } = this.config.filter_optimize.css;
  if (inExcludes(data.path, excludes)) return str;
  return css.transform({
    code  : Buffer.from(str),
    minify: true
  }).code.toString();
};
