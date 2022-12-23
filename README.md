# hexo-optimize

[![Build Status][github-image]][github-url]
[![npm-image]][npm-url]
[![lic-image]](LICENSE)

A hexo plugin that optimize the pages loading speed.

It will automatically filter your html file, find the `<link rel="stylesheet">` tag and make optimizations on demand, for example:
- Inline the `main.css` into the html page, to speed up your site's First Contentful Paint. (Useful when HTTP/2 Server Push is not available on your web server)
- Load CSS asynchronously or deferred.

It will help you get a higher score in the [Google PageSpeed Insights](https://pagespeed.web.dev).

## Installation

![size-image]
[![dm-image]][npm-url]
[![dt-image]][npm-url]

```bash
npm install hexo-optimize
```

## Usage

Activate the plugin in hexo's `_config.yml` like this:
```yml
filter_optimize:
  enable: true
  # static resource versioning
  versioning: false
  css:
    # minify all css files
    minify: true
    excludes:
    # use preload to load css elements dynamically
    delivery:
      - '@fortawesome/fontawesome-free'
      - 'fonts.googleapis.com'
    # make specific css content inline into the html page
    inlines:
      # support full path only
      - css/main.css
  js:
    # minify all js files
    minify: true
    excludes:
    # remove the comments in each of the js files
    remove_comments: false
  html:
    # minify all html files
    minify: true
    excludes:
  # set the priority of this plugin,
  # lower means it will be executed first, default of Hexo is 10
  priority: 12
```

This plugin can be disabled by `NODE_ENV` in development to boost `hexo generate`:
```
export NODE_ENV=development
```

## Comparison

Here is a result from [GTmetrix](https://gtmetrix.com) to show you the changes between before and after. (Same web server located in Tokyo, Japan, vultr.com)

* **Remove query strings from static resources** - let all the proxies could cache resources well. (https://gtmetrix.com/remove-query-strings-from-static-resources.html)
* **Make fewer HTTP requests** - through combined the loaded js files into the one.
* **Prefer asynchronous resources** - change the css delivery method using a script block instead of link tag.
* And TODOs ...

![Comparison](https://user-images.githubusercontent.com/980449/35233293-a8229c72-ffd8-11e7-8a23-3b8bc10d40c3.png)

[github-image]: https://img.shields.io/github/actions/workflow/status/next-theme/hexo-optimize/linter.yml?branch=main&style=flat-square
[npm-image]: https://img.shields.io/npm/v/hexo-optimize.svg?style=flat-square
[lic-image]: https://img.shields.io/npm/l/hexo-optimize?style=flat-square

[size-image]: https://img.shields.io/github/languages/code-size/next-theme/hexo-optimize?style=flat-square
[dm-image]: https://img.shields.io/npm/dm/hexo-optimize?style=flat-square
[dt-image]: https://img.shields.io/npm/dt/hexo-optimize?style=flat-square

[github-url]: https://github.com/next-theme/hexo-optimize/actions?query=workflow%3ALinter
[npm-url]: https://www.npmjs.com/package/hexo-optimize
