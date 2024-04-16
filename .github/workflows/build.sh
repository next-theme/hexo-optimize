ldd --version
curl https://sh.rustup.rs -sSf | sh -s -- -y
source "$HOME/.cargo/env"
npm run build-release
node -e "console.log(require('./index.node'))"
node .github/workflows/deploy.js index.node hexo-optimize/bin/nodejs/$(node -e "console.log(require('./package.json').version);")/linux__x64.node
