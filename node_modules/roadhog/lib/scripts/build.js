"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _yargs = _interopRequireDefault(require("yargs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const argv = _yargs.default.option('watch', {
  alias: 'w',
  default: false
}).argv;

let entry;

if (argv._.length > 0) {
  entry = argv._[0];
}

process.env.NODE_ENV = 'production';

require('../build').default({
  cwd: process.cwd(),
  watch: argv.watch,
  entry
}).catch(e => {
  console.error(_chalk.default.red(`Build failed: ${e.message}`));
  console.log(e);
});