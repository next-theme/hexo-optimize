const Promise = require('bluebird');
const micromatch = require('micromatch');
const crypto = require('crypto');

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

function hash(str) {
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 8);
}

module.exports = { streamRead, inExcludes, hash };
