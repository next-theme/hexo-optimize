#!/bin/sh
# ============================================================== #
# Shell script to autodeploy Hexo & NexT & NexT website source.
# ============================================================== #
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin:$PATH
export PATH

# https://en.wikipedia.org/wiki/ANSI_escape_code
#red='\033[0;31m'
#green='\033[0;32m'
#brown='\033[0;33m'
#blue='\033[0;34m'
#purple='\033[0;35m'
cyan='\033[0;36m'
#lgray='\033[0;37m'
#dgray='\033[1;30m'
lred='\033[1;31m'
lgreen='\033[1;32m'
yellow='\033[1;33m'
lblue='\033[1;34m'
lpurple='\033[1;35m'
lcyan='\033[1;36m'
white='\033[1;37m'
norm='\033[0m'
bold='\033[1m'

echo
echo "=============================================================="
echo " ${yellow}Checking starting directory structure...${norm}"
echo "=============================================================="
    echo "${lcyan}`pwd`${norm}"
    du -sh
    du -sh *

echo
echo "=============================================================="
echo " ${lgreen}Checking Node.js & NPM version...${norm}"
echo "=============================================================="
    echo "${yellow}Node version:${norm} ${lcyan}`node -v`${norm}"
    echo "${yellow}NPM version:${norm} ${lcyan}`npm -v`${norm}"

echo
echo "=============================================================="
echo " ${lgreen}Installing Hexo & NPM modules...${norm}"
echo "=============================================================="
    git clone https://github.com/hexojs/hexo-theme-unit-test tmp
    cd tmp
    npm install --silent
    npm install hexo-theme-next hexo-optimize

echo
echo "=============================================================="
echo " ${lgreen}Edit config file...${norm}"
echo "=============================================================="
    echo "
filter_optimize:
  enable: true
  css:
    # minify all css files
    minify: false
    excludes:
    # use preload to load css elements dynamically
    delivery:
      - 'font-awesome'
      - 'fonts.googleapis.com'
    # make specific css content inline into the html page
    inlines:
      # support full path only
      - css/main.css
  js:
    # minify all js files
    minify: false
    excludes:
    # remove the comments in each of the js files
    remove_comments: false
  html:
    # minify all html files
    minify: false
    excludes:
  # set the priority of this plugin,
  # lower means it will be executed first, default of Hexo is 10
  priority: 12" >> _config.yml

echo
echo "=============================================================="
echo " ${yellow}Checking Hexo version...${norm}"
echo "=============================================================="
    hexo() {
        npx hexo "$@"
    }
    hexo -v
    npm ls --depth 0
    hexo config theme next
    hexo config theme_config.motion.enable false
    hexo config theme_config.font.enable true
    cp _config.yml _config.yml.bak

echo
echo "=============================================================="
echo " ${lpurple}Generating content for All Optimization...${norm}"
echo "=============================================================="
    hexo config url https://hexo-optimize.netlify.app/all
    hexo clean && hexo g

    echo "${lred}`mv -v public all`${norm}"

echo
echo "=============================================================="
echo " ${lpurple}Generating content for CSS Delivery...${norm}"
echo "=============================================================="
    hexo config url https://hexo-optimize.netlify.app/delivery
    hexo config filter_optimize.css.inlines null
    sed -i 's/inlines: null//g' _config.yml
    hexo clean && hexo g

    echo "${lred}`mv -v public delivery`${norm}"

echo
echo "=============================================================="
echo " ${lpurple}Generating content for CSS Inlines...${norm}"
echo "=============================================================="
    cp _config.yml.bak _config.yml
    hexo config url https://hexo-optimize.netlify.app/inlines
    hexo config filter_optimize.css.delivery null
    sed -i 's/delivery: null//g' _config.yml
    hexo clean && hexo g

    echo "${lred}`mv -v public inlines`${norm}"

echo
echo "=============================================================="
echo " ${lpurple}Generating content for None Optimization...${norm}"
echo "=============================================================="
    hexo config url https://hexo-optimize.netlify.app/none
    hexo config filter_optimize.css.inlines null
    sed -i 's/inlines: null//g' _config.yml
    hexo clean && hexo g

    echo "${lred}`mv -v public none`${norm}"

echo
echo "=============================================================="
echo " ${lpurple}Moving all schemes to public directory...${norm}"
echo "=============================================================="
    mkdir public
    echo "${lred}`mv -v all delivery inlines none -t public`${norm}"

    echo "${yellow}robots.txt:${norm}"
    echo "User-agent: *
Disallow: /*
Host: https://hexo-optimize.netlify.app" > public/robots.txt
    cat public/robots.txt

echo
echo "=============================================================="
echo " ${yellow}Checking 'repo' directory structure...${norm}"
echo "=============================================================="
    echo "${lcyan}`pwd`${norm}"
    du -sh
    du -sh *

echo
echo "=============================================================="
echo " ${yellow}Checking 'public' directory structure...${norm}"
echo "=============================================================="
    cd public
    echo "${lcyan}`pwd`${norm}"
    du -sh
    du -sh *

echo
echo "=============================================================="
echo " ${lgreen}Done. Beginning to deploy site...${norm}"
echo "=============================================================="
