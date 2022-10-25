const Promise = require('bluebird');
const micromatch = require('micromatch');
const { parse } = require('url');
const { join } = require('path');
const { streamRead } = require('./util');
const html = require('./html');

function minify(str, path, config, cssFiles) {
  const { root, filter_optimize } = config;
  const { inlines, delivery } = filter_optimize.css;
  str = str.replace(/<link rel="stylesheet"[^>]*\shref="([^"]+)"[^>]*>/ig, (match, href) => {
    // Exit if the href attribute doesn't exist.
    if (!href) return match;

    const link = parse(href);
    for (const path of inlines) {
      if (link.pathname === join(root, path)) {
        return `<style>${cssFiles[path]}</style>`;
      }
    }
    if (delivery.some(pattern => link.href.includes(pattern))) {
      return `<link rel="preload" href="${link.href}" as="style" onload="this.rel='stylesheet'">`;
    }
    return match;
  });
  if (filter_optimize.html.minify) {
    return html(str, path, config);
  }
  return str;
}

module.exports = function() {

  const { route, config } = this;
  const { inlines } = config.filter_optimize.css;

  const list = route.list();
  const htmls = list.filter(path => micromatch.isMatch(path, '**/*.html', { nocase: true }));
  return Promise.map(inlines, path => {
    const stream = route.get(path);
    return streamRead(stream).then(str => [path, str]);
  }).then(cssFiles => {
    cssFiles = Object.fromEntries(cssFiles);
    return Promise.map(htmls, path => {
      const stream = route.get(path);
      return streamRead(stream)
        .then(str => {
          str = minify(str, path, config, cssFiles);
          if (str) route.set(path, str);
        });
    });
  });
};
