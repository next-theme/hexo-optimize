const Terser = require('terser');
const { inExcludes } = require('./util');

module.exports = function(str, data) {
  const { excludes, remove_comments } = this.config.filter_optimize.js;
  if (inExcludes(data.path, excludes)) return str;
  return Terser.minify(str, {
    output: {
      comments: !remove_comments
    }
  }).then(res => res.code);
};
