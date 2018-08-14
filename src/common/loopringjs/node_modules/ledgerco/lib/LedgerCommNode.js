"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeHid = require("node-hid");

var _nodeHid2 = _interopRequireDefault(_nodeHid);

var _utils = require("./utils");

var _LedgerComm2 = require("./LedgerComm");

var _LedgerComm3 = _interopRequireDefault(_LedgerComm2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /********************************************************************************
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   Ledger Node JS API
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   (c) 2016-2017 Ledger
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *      http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ********************************************************************************/


var LedgerNode = function (_LedgerComm) {
  _inherits(LedgerNode, _LedgerComm);

  function LedgerNode(device, ledgerTransport) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var debug = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    _classCallCheck(this, LedgerNode);

    var _this = _possibleConstructorReturn(this, (LedgerNode.__proto__ || Object.getPrototypeOf(LedgerNode)).call(this));

    _this.device = device;
    _this.ledgerTransport = ledgerTransport;
    _this.timeout = timeout;
    _this.exchangeStack = [];
    _this.debug = debug;
    return _this;
  }

  _createClass(LedgerNode, [{
    key: "exchange",
    value: function exchange(apduHex, statusList) {
      var _this2 = this;

      function ledgerWrap(channel, command, packetSize) {
        var sequenceIdx = 0;
        var offset = 0;

        var tmp = Buffer.alloc(7);
        tmp.writeUInt16BE(channel, 0);
        tmp[2] = 0x05; // TAG_APDU
        tmp.writeUInt16BE(sequenceIdx, 3);
        sequenceIdx++;
        tmp.writeUInt16BE(command.length, 5);
        var blockSize = command.length > packetSize - 7 ? packetSize - 7 : command.length;
        var result = Buffer.concat([tmp, command.slice(offset, offset + blockSize)], blockSize + 7);
        offset += blockSize;
        while (offset !== command.length) {
          tmp = Buffer.alloc(5);
          tmp.writeUInt16BE(channel, 0);
          tmp[2] = 0x05; // TAG_APDU
          tmp.writeUInt16BE(sequenceIdx, 3);
          sequenceIdx++;
          blockSize = command.length - offset > packetSize - 5 ? packetSize - 5 : command.length - offset;
          result = Buffer.concat([result, tmp, command.slice(offset, offset + blockSize)], result.length + blockSize + 5);
          offset += blockSize;
        }
        return result;
      }

      function ledgerUnwrap(channel, data, packetSize) {
        var offset = 0;
        var responseLength = void 0;
        var sequenceIdx = 0;
        var response = void 0;
        if (typeof data === "undefined" || data.length < 7 + 5) {
          return;
        }
        if (data[offset++] !== channel >> 8) {
          throw "Invalid channel;";
        }
        if (data[offset++] !== (channel & 0xff)) {
          throw "Invalid channel";
        }
        if (data[offset++] !== 0x05) {
          throw "Invalid tag";
        }
        if (data[offset++] !== 0x00) {
          throw "Invalid sequence";
        }
        if (data[offset++] !== 0x00) {
          throw "Invalid sequence";
        }
        responseLength = (data[offset++] & 0xff) << 8;
        responseLength |= data[offset++] & 0xff;
        if (data.length < 7 + responseLength) {
          return;
        }
        var blockSize = responseLength > packetSize - 7 ? packetSize - 7 : responseLength;
        response = data.slice(offset, offset + blockSize);
        offset += blockSize;
        while (response.length !== responseLength) {
          sequenceIdx++;
          if (offset === data.length) {
            return;
          }
          if (data[offset++] !== channel >> 8) {
            throw "Invalid channel;";
          }
          if (data[offset++] !== (channel & 0xff)) {
            throw "Invalid channel";
          }
          if (data[offset++] !== 0x05) {
            throw "Invalid tag";
          }
          if (data[offset++] !== sequenceIdx >> 8) {
            throw "Invalid sequence";
          }
          if (data[offset++] !== (sequenceIdx & 0xff)) {
            throw "Invalid sequence";
          }
          blockSize = responseLength - response.length > packetSize - 5 ? packetSize - 5 : responseLength - response.length;
          if (blockSize > data.length - offset) {
            return;
          }
          response = Buffer.concat([response, data.slice(offset, offset + blockSize)], response.length + blockSize);
          offset += blockSize;
        }
        return response;
      }

      var apdu = Buffer.from(apduHex, "hex");

      var deferred = (0, _utils.defer)();
      var exchangeTimeout = void 0;
      var transport = void 0;
      if (!this.ledgerTransport) {
        transport = apdu;
      } else {
        transport = ledgerWrap(0x0101, apdu, 64);
      }

      if (this.timeout !== 0) {
        exchangeTimeout = setTimeout(function () {
          // Node.js supports timeouts
          deferred.reject("timeout");
        }, this.timeout);
      }

      // enter the exchange wait list
      this.exchangeStack.push(deferred);

      if (this.exchangeStack.length === 1) {
        var processNextExchange = function processNextExchange() {
          // don't pop it now, to avoid multiple at once
          var deferred = _this2.exchangeStack[0];

          var send_async = function send_async(content) {
            if (_this2.debug) {
              console.log("=>" + content.toString("hex"));
            }
            var data = [0x00];
            for (var i = 0; i < content.length; i++) {
              data.push(content[i]);
            }
            _this2.device.write(data);
            return Promise.resolve(content.length);
          };

          var recv_async = function recv_async() {
            return new Promise(function (resolve, reject) {
              return _this2.device.read(function (err, res) {
                if (err || !res) reject(err);else {
                  var buffer = Buffer.from(res);
                  if (_this2.debug) {
                    console.log("<=" + buffer.toString("hex"));
                  }
                  resolve(buffer);
                }
              });
            });
          };

          var performExchange = function performExchange() {
            var offsetSent = 0;
            var firstReceived = true;
            var toReceive = 0;

            var received = Buffer.alloc(0);
            var sendPart = function sendPart() {
              if (offsetSent === transport.length) {
                return receivePart();
              }
              var blockSize = transport.length - offsetSent > 64 ? 64 : transport.length - offsetSent;
              var block = transport.slice(offsetSent, offsetSent + blockSize);
              var paddingSize = 64 - block.length;
              if (paddingSize !== 0) {
                var padding = Buffer.alloc(paddingSize).fill(0);
                block = Buffer.concat([block, padding], block.length + paddingSize);
              }
              return send_async(block).then(function () {
                offsetSent += blockSize;
                return sendPart();
              });
            };

            var receivePart = function receivePart() {
              if (!_this2.ledgerTransport) {
                return recv_async().then(function (result) {
                  received = Buffer.concat([received, result], received.length + result.length);
                  if (firstReceived) {
                    firstReceived = false;
                    if (received.length === 2 || received[0] !== 0x61) {
                      return received;
                    } else {
                      toReceive = received[1];
                      if (toReceive === 0) {
                        toReceive = 256;
                      }
                      toReceive += 2;
                    }
                  }
                  if (toReceive < 64) {
                    return received;
                  } else {
                    toReceive -= 64;
                    return receivePart();
                  }
                });
              } else {
                return recv_async().then(function (result) {
                  received = Buffer.concat([received, result], received.length + result.length);
                  var response = ledgerUnwrap(0x0101, received, 64);
                  if (typeof response !== "undefined") {
                    return response;
                  } else {
                    return receivePart();
                  }
                });
              }
            };
            return sendPart();
          };

          performExchange().then(function (result) {
            var status = void 0,
                response = void 0,
                resultBin = result;
            if (!_this2.ledgerTransport) {
              if (resultBin.length === 2 || resultBin[0] !== 0x61) {
                status = resultBin[0] << 8 | resultBin[1];
                response = resultBin.toString("hex");
              } else {
                var size = resultBin[1];
                // fake T0
                if (size === 0) {
                  size = 256;
                }

                response = resultBin.toString("hex", 2);
                status = resultBin[2 + size] << 8 | resultBin[2 + size + 1];
              }
            } else {
              response = resultBin.toString("hex");
              status = resultBin[resultBin.length - 2] << 8 | resultBin[resultBin.length - 1];
            }
            // Check the status
            var statusFound = statusList.some(function (s) {
              return s === status;
            });
            if (!statusFound) {
              deferred.reject("Invalid status " + status.toString(16));
            }
            // build the response
            if (_this2.timeout !== 0) {
              clearTimeout(exchangeTimeout);
            }
            return response;
          }).then(function (response) {
            // consume current promise
            _this2.exchangeStack.shift();

            // schedule next exchange
            if (_this2.exchangeStack.length > 0) {
              processNextExchange();
            }
            return response;
          }, function (err) {
            if (_this2.timeout !== 0) {
              clearTimeout(exchangeTimeout);
            }
            throw err;
          })
          // plug to deferred
          .then(deferred.resolve, deferred.reject);
        };

        // schedule next exchange
        processNextExchange();
      }

      // the exchangeStack will process the promise when possible
      return deferred.promise;
    }
  }, {
    key: "setScrambleKey",
    value: function setScrambleKey() {}
  }, {
    key: "close_async",
    value: function close_async() {
      this.device.close();
      return Promise.resolve();
    }
  }]);

  return LedgerNode;
}(_LedgerComm3.default);

LedgerNode.list_async = function () {
  return Promise.resolve(_nodeHid2.default.devices().filter(function (device) {
    return device.vendorId === 0x2581 && device.productId === 0x3b7c || device.vendorId === 0x2c97;
  }).map(function (d) {
    return d.path;
  }));
};

LedgerNode.create_async = function (timeout, debug) {
  return LedgerNode.list_async().then(function (result) {
    if (result.length === 0) {
      throw "No device found";
    }
    return new LedgerNode(new _nodeHid2.default.HID(result[0]), true, timeout, debug);
  });
};

exports.default = LedgerNode;