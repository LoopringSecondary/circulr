"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = send;
exports.OPEN_FILE = exports.RESTART = exports.STARTING = exports.DONE = exports.COMPILING = void 0;

const debug = require('debug')('af-webpack:send');

const COMPILING = 'COMPILING';
exports.COMPILING = COMPILING;
const DONE = 'DONE';
exports.DONE = DONE;
const STARTING = 'STARTING';
exports.STARTING = STARTING;
const RESTART = 'RESTART';
exports.RESTART = RESTART;
const OPEN_FILE = 'OPEN_FILE';
exports.OPEN_FILE = OPEN_FILE;

function send(message) {
  if (process.send) {
    debug(`send ${JSON.stringify(message)}`);
    process.send(message);
  }
}