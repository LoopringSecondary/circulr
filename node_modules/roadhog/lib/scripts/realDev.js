"use strict";

var _yargs = require("yargs");

// 修复 Ctrl+C 时 dev server 没有正常退出的问题
process.on('SIGINT', () => {
  process.exit(1);
});
const ops = {};

if (_yargs.argv._.length > 0) {
  const entry = _yargs.argv._[0];
  ops.entry = entry;
}

process.env.NODE_ENV = 'development';

require('../dev').default(ops);