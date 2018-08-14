"use strict";

var _umiTest = _interopRequireDefault(require("umi-test"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const args = process.argv.slice(2);
const watch = args.indexOf('-w') > -1 || args.indexOf('--watch') > -1;
const coverage = args.indexOf('--coverage') > -1;
(0, _umiTest.default)({
  watch,
  coverage
}).catch(e => {
  console.log(e);
  process.exit(1);
});