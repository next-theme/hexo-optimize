const Promise = require('bluebird');
const micromatch = require('micromatch');

const Imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const gifsicle = require('imagemin-gifsicle');
const jpegtran = require('imagemin-jpegtran');
const optipng = require('imagemin-optipng');
const svgo = require('imagemin-svgo');

const { streamRead } = require('./util');

module.exports = function() {

  const { route, config } = this;
  const options = config.filter_optimize.image;
  const { progressive, interlaced, optimizationLevel, multipass } = options;
  const list = route.list();

  // Filter images.
  const images = list.filter(path => micromatch.isMatch(path, '**/*.{jpg,png,gif,svg}', { nocase: true }));
  // Retrieve image contents, and minify it.
  return Promise.map(images, path => {
    // Retrieve and concatenate buffers.
    const stream = route.get(path);
    streamRead(stream, true)
      .then(buffer => {
        // Create the Imagemin instance.
        const imageminOption = {
          plugins: [
            mozjpeg({ progressive }),
            gifsicle({ interlaced }),
            jpegtran({ progressive }),
            optipng({ optimizationLevel }),
            svgo({ multipass })
          ]
        };

        // Add additional plugins.
        if (options.pngquant) { // Lossy compression.
          imageminOption.plugins.push(pngquant());
        }

        return Imagemin.buffer(buffer, imageminOption)
          .then((newBuffer) => {
            const length = buffer.length;
            if (newBuffer && length > newBuffer.length) {
              //const saved = ((length - newBuffer.length) / length * 100).toFixed(2);
              //hexo.log[options.silent ? 'debug' : 'info']('update Optimize IMG: %s [ %s saved]', path, saved + '%');
              route.set(path, newBuffer); // Update the route.
            }
          });
      });
  });
};
