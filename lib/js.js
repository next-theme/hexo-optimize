const Terser = require('terser');
const { inExcludes } = require('./util');

module.exports = function(str, data) {
  const { js } = this.config.filter_optimize;
  if (inExcludes(data.path, js.excludes)) return str;
  return Terser.minify(str, {
    output: {
      comments: !js.remove_comments
    }
  }).then(res => res.code);
};
