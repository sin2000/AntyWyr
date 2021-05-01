'use strict';

browser.userScripts.register({
  matches: ["https://www.wykop.pl/*"],
  js: [{file: "./substitute.js"}]
});

