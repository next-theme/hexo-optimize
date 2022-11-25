const Promise = require('bluebird');
const micromatch = require('micromatch');
const { URL } = require('url');
const { join, parse } = require('path');
const { streamRead, hash } = require('./util');
const html = require('./html');

function minify(str, path, config, { cssFiles, jsMap, cssMap }) {
  const { url, root, filter_optimize } = config;
  const { inlines, delivery } = filter_optimize.css;
  str = str.replace(/<link rel="stylesheet"[^>]*\shref="([^"]+)"[^>]*>/ig, (match, href) => {
    // Exit if the href attribute doesn't exist.
    if (!href) return match;

    const link = new URL(href, url);
    const originalURL = link.href;
    for (const path of inlines) {
      if (link.pathname === join(root, path)) {
        return `<style>${cssFiles[path]}</style>`;
      }
    }
    for (const path in cssMap) {
      if (link.pathname === join(root, path)) {
        link.pathname = join(root, cssMap[path]);
        continue;
      }
    }
    const newURL = link.hostname === new URL(url).hostname ? link.pathname : link.href;
    if (delivery.some(pattern => originalURL.includes(pattern))) {
      return `<link rel="preload" href="${newURL}" as="style" onload="this.rel='stylesheet'">`;
    }
    return match.replace(href, newURL);
  }).replace(/<script[^>]*\ssrc="([^"]+)"[^>]*>/ig, (match, src) => {
    // Exit if the src attribute doesn't exist.
    if (!src) return match;

    const link = new URL(src, url);

    for (const path in jsMap) {
      if (link.pathname === join(root, path)) {
        link.pathname = join(root, jsMap[path]);
        continue;
      }
    }
    const newURL = link.hostname === new URL(url).hostname ? link.pathname : link.href;
    return match.replace(src, newURL);
  });
  if (filter_optimize.html.minify) {
    return html(str, path, config);
  }
  return str;
}

module.exports = async function() {

  const { route, config } = this;
  const { inlines } = config.filter_optimize.css;

  const list = route.list();
  const htmls = list.filter(path => micromatch.isMatch(path, '**/*.html', { nocase: true }));

  const cssFiles = {};
  const jsMap = {};
  const cssMap = {};

  await Promise.map(inlines, async path => {
    const str = await streamRead(route, path);
    cssFiles[path] = str;
  });

  if (config.filter_optimize.versioning) {
    const js = list.filter(path => micromatch.isMatch(path, '**/*.js', { nocase: true }));
    const css = list.filter(path => micromatch.isMatch(path, '**/*.css', { nocase: true }));

    await Promise.map(js, async path => {
      const str = await streamRead(route, path);
      const { dir, name, ext } = parse(path);
      const newPath = join(dir, `${name}-${hash(str)}${ext}`);
      route.set(newPath, str);
      jsMap[path] = newPath;
    });

    await Promise.map(css, async path => {
      let str;
      if (path in cssFiles) {
        str = cssFiles[path];
      } else {
        str = await streamRead(route, path);
      }
      const { dir, name, ext } = parse(path);
      const newPath = join(dir, `${name}-${hash(str)}${ext}`);
      route.set(newPath, str);
      cssMap[path] = newPath;
    });
  }

  await Promise.map(htmls, async path => {
    let str = await streamRead(route, path);
    str = minify(str, path, config, { cssFiles, jsMap, cssMap });
    route.set(path, str);
  });
};
