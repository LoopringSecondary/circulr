"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /********************************************************************************
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


var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LedgerEth = function () {
  function LedgerEth(comm) {
    _classCallCheck(this, LedgerEth);

    this.comm = comm;
    comm.setScrambleKey("w0w");
  }

  _createClass(LedgerEth, [{
    key: "getAddress_async",
    value: function getAddress_async(path, boolDisplay, boolChaincode) {
      var paths = (0, _utils.splitPath)(path);
      var buffer = new Buffer(5 + 1 + paths.length * 4);
      buffer[0] = 0xe0;
      buffer[1] = 0x02;
      buffer[2] = boolDisplay ? 0x01 : 0x00;
      buffer[3] = boolChaincode ? 0x01 : 0x00;
      buffer[4] = 1 + paths.length * 4;
      buffer[5] = paths.length;
      paths.forEach(function (element, index) {
        buffer.writeUInt32BE(element, 6 + 4 * index);
      });
      return this.comm.exchange(buffer.toString("hex"), [0x9000]).then(function (responseHex) {
        var result = {};
        var response = new Buffer(responseHex, "hex");
        var publicKeyLength = response[0];
        var addressLength = response[1 + publicKeyLength];
        result.publicKey = response.slice(1, 1 + publicKeyLength).toString("hex");
        result.address = "0x" + response.slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength).toString("ascii");
        if (boolChaincode) {
          result.chainCode = response.slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32).toString("hex");
        }
        return result;
      });
    }
  }, {
    key: "signTransaction_async",
    value: function signTransaction_async(path, rawTxHex) {
      var _this = this;

      var paths = (0, _utils.splitPath)(path);
      var offset = 0;
      var rawTx = new Buffer(rawTxHex, "hex");
      var apdus = [];
      var response = [];

      var _loop = function _loop() {
        var maxChunkSize = offset === 0 ? 150 - 1 - paths.length * 4 : 150;
        var chunkSize = offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize;
        var buffer = new Buffer(offset === 0 ? 5 + 1 + paths.length * 4 + chunkSize : 5 + chunkSize);
        buffer[0] = 0xe0;
        buffer[1] = 0x04;
        buffer[2] = offset === 0 ? 0x00 : 0x80;
        buffer[3] = 0x00;
        buffer[4] = offset === 0 ? 1 + paths.length * 4 + chunkSize : chunkSize;
        if (offset === 0) {
          buffer[5] = paths.length;
          paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 6 + 4 * index);
          });
          rawTx.copy(buffer, 6 + 4 * paths.length, offset, offset + chunkSize);
        } else {
          rawTx.copy(buffer, 5, offset, offset + chunkSize);
        }
        apdus.push(buffer.toString("hex"));
        offset += chunkSize;
      };

      while (offset !== rawTx.length) {
        _loop();
      }
      return (0, _utils.foreach)(apdus, function (apdu) {
        return _this.comm.exchange(apdu, [0x9000]).then(function (apduResponse) {
          response = apduResponse;
        });
      }).then(function () {
        response = new Buffer(response, "hex");
        var v = response.slice(0, 1).toString("hex");
        var r = response.slice(1, 1 + 32).toString("hex");
        var s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
        return { v: v, r: r, s: s };
      });
    }
  }, {
    key: "getAppConfiguration_async",
    value: function getAppConfiguration_async() {
      var buffer = new Buffer(5);
      buffer[0] = 0xe0;
      buffer[1] = 0x06;
      buffer[2] = 0x00;
      buffer[3] = 0x00;
      buffer[4] = 0x00;
      return this.comm.exchange(buffer.toString("hex"), [0x9000]).then(function (responseHex) {
        var result = {};
        var response = Buffer.from(responseHex, "hex");
        result.arbitraryDataEnabled = response[0] & 0x01;
        result.version = "" + response[1] + "." + response[2] + "." + response[3];
        return result;
      });
    }
  }, {
    key: "signPersonalMessage_async",
    value: function signPersonalMessage_async(path, messageHex) {
      var _this2 = this;

      var paths = (0, _utils.splitPath)(path);
      var offset = 0;
      var message = new Buffer(messageHex, "hex");
      var apdus = [];
      var response = [];

      var _loop2 = function _loop2() {
        var maxChunkSize = offset === 0 ? 150 - 1 - paths.length * 4 - 4 : 150;
        var chunkSize = offset + maxChunkSize > message.length ? message.length - offset : maxChunkSize;
        var buffer = new Buffer(offset === 0 ? 5 + 1 + paths.length * 4 + 4 + chunkSize : 5 + chunkSize);
        buffer[0] = 0xe0;
        buffer[1] = 0x08;
        buffer[2] = offset === 0 ? 0x00 : 0x80;
        buffer[3] = 0x00;
        buffer[4] = offset === 0 ? 1 + paths.length * 4 + 4 + chunkSize : chunkSize;
        if (offset === 0) {
          buffer[5] = paths.length;
          paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 6 + 4 * index);
          });
          buffer.writeUInt32BE(message.length, 6 + 4 * paths.length);
          message.copy(buffer, 6 + 4 * paths.length + 4, offset, offset + chunkSize);
        } else {
          message.copy(buffer, 5, offset, offset + chunkSize);
        }
        apdus.push(buffer.toString("hex"));
        offset += chunkSize;
      };

      while (offset !== message.length) {
        _loop2();
      }
      return (0, _utils.foreach)(apdus, function (apdu) {
        return _this2.comm.exchange(apdu, [0x9000]).then(function (apduResponse) {
          response = apduResponse;
        });
      }).then(function () {
        response = new Buffer(response, "hex");
        var v = response[0];
        var r = response.slice(1, 1 + 32).toString("hex");
        var s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
        return { v: v, r: r, s: s };
      });
    }
  }]);

  return LedgerEth;
}();

exports.default = LedgerEth;