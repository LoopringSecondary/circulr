"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _u2fApi = require("u2f-api");

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


function wrapApdu(apdu, key) {
  var result = Buffer.alloc(apdu.length);
  for (var i = 0; i < apdu.length; i++) {
    result[i] = apdu[i] ^ key[i % key.length];
  }
  return result;
}

// Convert from normal to web-safe, strip trailing "="s
var webSafe64 = function webSafe64(base64) {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Convert from web-safe to normal, add trailing "="s
var normal64 = function normal64(base64) {
  return base64.replace(/-/g, "+").replace(/_/g, "/") + "==".substring(0, 3 * base64.length % 4);
};

function u2fPromise(response, statusList) {
  var signatureData = response.signatureData;

  return new Promise(function (resolve, reject) {
    if (typeof signatureData === "string") {
      var data = Buffer.from(normal64(signatureData), "base64");
      if (typeof statusList !== "undefined") {
        var sw = data.readUInt16BE(data.length - 2);
        var statusFound = statusList.some(function (s) {
          return s === sw;
        });
        if (!statusFound) {
          reject("Invalid status " + sw.toString(16));
        }
      }
      resolve(data.toString("hex", 5));
    } else {
      reject(response);
    }
  });
}

var LedgerU2F = function (_LedgerComm) {
  _inherits(LedgerU2F, _LedgerComm);

  function LedgerU2F() {
    var timeoutSeconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20;

    _classCallCheck(this, LedgerU2F);

    var _this = _possibleConstructorReturn(this, (LedgerU2F.__proto__ || Object.getPrototypeOf(LedgerU2F)).call(this));

    _this.timeoutSeconds = timeoutSeconds;
    return _this;
  }

  _createClass(LedgerU2F, [{
    key: "exchange",
    value: function exchange(apduHex, statusList) {
      var apdu = Buffer.from(apduHex, "hex");
      var keyHandle = wrapApdu(apdu, this.scrambleKey);
      var challenge = Buffer.from("0000000000000000000000000000000000000000000000000000000000000000", "hex");
      var signRequest = {
        version: "U2F_V2",
        keyHandle: webSafe64(keyHandle.toString("base64")),
        challenge: webSafe64(challenge.toString("base64")),
        appId: location.origin
      };
      return (0, _u2fApi.sign)(signRequest, this.timeoutSeconds).then(function (result) {
        return u2fPromise(result, statusList);
      });
    }
  }, {
    key: "setScrambleKey",
    value: function setScrambleKey(scrambleKey) {
      this.scrambleKey = Buffer.from(scrambleKey, "ascii");
    }
  }, {
    key: "close_async",
    value: function close_async() {
      return Promise.resolve();
    }
  }]);

  return LedgerU2F;
}(_LedgerComm3.default);

LedgerU2F.create_async = function (timeout) {
  return Promise.resolve(new LedgerU2F(timeout));
};

exports.default = LedgerU2F;