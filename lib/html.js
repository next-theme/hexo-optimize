const minifyHtml = require('@minify-html/node');
const { inExcludes } = require('./util');

module.exports = function(str, data) {
  const { html } = this.config.filter_optimize;
  if (inExcludes(data.path, html.excludes)) return str;
  return minifyHtml.minify(Buffer.from(str), {
    keep_spaces_between_attributes: true,
    keep_comments                 : true
  });
};
