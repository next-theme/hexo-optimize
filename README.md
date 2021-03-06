# hexo-optimize

[![Build Status][github-image]][github-url]
[![npm-image]][npm-url]
[![lic-image]](LICENSE)

A hexo plugin that optimize the pages loading speed.

It will auto filter your html file, find the `<link rel="stylesheet">` block and replace them into a javascript to [optimize CSS delivery](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery).

And inline the `main.css` into the html page like [@maple3142 does](https://github.com/maple3142/Blog/blob/master/gulpfile.js).

It will improve your pages loading and get a higher score in the [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/).

**Known Issues:** This plugin may cause Font Awesome and PJAX to fail to load.

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
  # remove the surrounding comments in each of the bundled files
  remove_comments: false
  css:
    # minify all css files
    minify: true
    # bundle loaded css files into one
    bundle: true
    # use a script block to load css elements dynamically
    delivery: true
    # make specific css content inline into the html page
    #   - only support the full path
    #   - default is ['css/main.css']
    inlines:
    excludes:
  js:
    # minify all js files
    minify: true
    # bundle loaded js files into one
    bundle: true
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

Here is a [result](https://gtmetrix.com/compare/Z7BnLaPX/qSMKtzBY) from [GTmetrix](https://gtmetrix.com) to show you the changes between before and after. (Same web server located in Tokyo, Japan, vultr.com)

* **Remove query strings from static resources** - let all the proxies could cache resources well. (https://gtmetrix.com/remove-query-strings-from-static-resources.html)
* **Make fewer HTTP requests** - through combined the loaded js files into the one.
* **Prefer asynchronous resources** - change the css delivery method using a script block instead of link tag.
* And TODOs ...

![Comparison](https://user-images.githubusercontent.com/980449/35233293-a8229c72-ffd8-11e7-8a23-3b8bc10d40c3.png)

[github-image]: https://img.shields.io/github/workflow/status/next-theme/hexo-optimize/Linter?style=flat-square
[npm-image]: https://img.shields.io/npm/v/hexo-optimize.svg?style=flat-square
[lic-image]: https://img.shields.io/npm/l/hexo-optimize?style=flat-square

[size-image]: https://img.shields.io/github/languages/code-size/next-theme/hexo-optimize?style=flat-square
[dm-image]: https://img.shields.io/npm/dm/hexo-optimize?style=flat-square
[dt-image]: https://img.shields.io/npm/dt/hexo-optimize?style=flat-square

[github-url]: https://github.com/next-theme/hexo-optimize/actions?query=workflow%3ALinter
[npm-url]: https://www.npmjs.com/package/hexo-optimize
