let minifyHtml;
try {
  minifyHtml = require('../index.node');
} catch (error) {
}
const { inExcludes } = require('./util');

module.exports = function(str, path, config) {
  const { excludes } = config.filter_optimize.html;
  if (!minifyHtml || inExcludes(path, excludes)) return str;
  return minifyHtml.minify(Buffer.from(str), {
    keep_spaces_between_attributes: true,
    keep_comments                 : true
  });
};
