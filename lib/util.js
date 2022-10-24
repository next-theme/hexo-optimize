const Promise = require('bluebird');
const micromatch = require('micromatch');

function streamRead(stream, binary) {
  if (binary) {
    return new Promise((resolve, reject) => {
      const arr = [];
      stream
        .on('data', chunk => arr.push(chunk))
        .on('end', () => resolve(Buffer.concat(arr)))
        .on('error', reject);
    });
  }
  return new Promise((resolve, reject) => {
    let data = '';
    stream
      .on('data', chunk => {
        data += chunk.toString();
      })
      .on('end', () => resolve(data))
      .on('error', reject);
  });
}

// check whether `path` is in `excludes`
function inExcludes(path, excludes) {
  return excludes && excludes.some(item => micromatch.isMatch(path, item, { nocase: true }));
}

module.exports = { streamRead, inExcludes };
