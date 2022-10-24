/* global hexo */

'use strict';

hexo.config.filter_optimize = Object.assign({
  enable: true,
  css   : {
    minify  : true,
    excludes: [],
    delivery: [],
    inlines : []
  },
  js: {
    minify         : true,
    excludes       : [],
    remove_comments: false
  },
  image: {
    minify           : true,
    interlaced       : false,
    multipass        : false,
    optimizationLevel: 2,
    pngquant         : false,
    progressive      : false
  }
}, hexo.config.filter_optimize);

const config = hexo.config.filter_optimize;
if (process.env.NODE_ENV !== 'development' && config.enable) {
  const { filter, css, js } = require('./lib/index');
  const priority = parseInt(config.priority, 10) || 10;

  // Enable one of the optimizations.
  if (config.css.delivery.length || config.css.inlines.length) {
    hexo.extend.filter.register('after_generate', filter, priority);
  }
  if (config.css.minify) {
    hexo.extend.filter.register('after_render:css', css);
  }
  if (config.js.minify) {
    hexo.extend.filter.register('after_render:js', js);
  }
  if (config.image.minify) {
    //hexo.extend.filter.register('after_generate', image);
  }
}
