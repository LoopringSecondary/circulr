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

var MAX_SCRIPT_BLOCK = 50;
var DEFAULT_LOCKTIME = 0;
var DEFAULT_SEQUENCE = 0xffffffff;
var SIGHASH_ALL = 1;

var LedgerBtc = function () {
  function LedgerBtc(comm) {
    _classCallCheck(this, LedgerBtc);

    this.comm = comm;
    comm.setScrambleKey("BTC");
  }

  _createClass(LedgerBtc, [{
    key: "getWalletPublicKey_async",
    value: function getWalletPublicKey_async(path) {
      var paths = (0, _utils.splitPath)(path);
      var buffer = Buffer.alloc(5 + 1 + paths.length * 4);
      buffer[0] = 0xe0;
      buffer[1] = 0x40;
      buffer[2] = 0x00;
      buffer[3] = 0x00;
      buffer[4] = 1 + paths.length * 4;
      buffer[5] = paths.length;
      paths.forEach(function (element, index) {
        buffer.writeUInt32BE(element, 6 + 4 * index);
      });
      return this.comm.exchange(buffer.toString("hex"), [0x9000]).then(function (responseHex) {
        var response = Buffer.from(responseHex, "hex");
        var publicKeyLength = response[0];
        var addressLength = response[1 + publicKeyLength];
        var publicKey = response.slice(1, 1 + publicKeyLength).toString("hex");
        var bitcoinAddress = response.slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength).toString("ascii");
        var chainCode = response.slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32).toString("hex");
        return { publicKey: publicKey, bitcoinAddress: bitcoinAddress, chainCode: chainCode };
      });
    }
  }, {
    key: "getTrustedInputRaw_async",
    value: function getTrustedInputRaw_async(transactionData, indexLookup) {
      var data = void 0;
      var firstRound = false;
      if (typeof indexLookup === "number") {
        firstRound = true;
        var prefix = Buffer.alloc(4);
        prefix.writeUInt32BE(indexLookup, 0);
        data = Buffer.concat([prefix, transactionData], transactionData.length + 4);
      } else {
        data = transactionData;
      }
      var buffer = Buffer.alloc(5);
      buffer[0] = 0xe0;
      buffer[1] = 0x42;
      buffer[2] = firstRound ? 0x00 : 0x80;
      buffer[3] = 0x00;
      buffer[4] = data.length;
      buffer = Buffer.concat([buffer, data], 5 + data.length);
      return this.comm.exchange(buffer.toString("hex"), [0x9000]).then(function (trustedInput) {
        return trustedInput.substring(0, trustedInput.length - 4);
      });
    }
  }, {
    key: "getTrustedInput_async",
    value: function getTrustedInput_async(indexLookup, transaction) {
      var _this = this;

      var inputs = transaction.inputs,
          outputs = transaction.outputs,
          locktime = transaction.locktime;

      if (!outputs || !locktime) {
        throw new Error("getTrustedInput_async: locktime & outputs is expected");
      }

      var processScriptBlocks = function processScriptBlocks(script, sequence) {
        var scriptBlocks = [];
        var offset = 0;
        while (offset !== script.length) {
          var blockSize = script.length - offset > MAX_SCRIPT_BLOCK ? MAX_SCRIPT_BLOCK : script.length - offset;
          if (offset + blockSize !== script.length) {
            scriptBlocks.push(script.slice(offset, offset + blockSize));
          } else {
            scriptBlocks.push(Buffer.concat([script.slice(offset, offset + blockSize), sequence]));
          }
          offset += blockSize;
        }
        return (0, _utils.eachSeries)(scriptBlocks, function (scriptBlock) {
          return _this.getTrustedInputRaw_async(scriptBlock);
        });
      };

      var processInputs = function processInputs() {
        return (0, _utils.eachSeries)(inputs, function (input) {
          var data = Buffer.concat([input.prevout, _this.createVarint(input.script.length)]);
          return _this.getTrustedInputRaw_async(data).then(function () {
            return (
              // iteration (eachSeries) ended
              // TODO notify progress
              // deferred.notify("input");
              processScriptBlocks(input.script, input.sequence)
            );
          });
        }).then(function () {
          var data = _this.createVarint(outputs.length);
          return _this.getTrustedInputRaw_async(data);
        });
      };

      var processOutputs = function processOutputs() {
        return (0, _utils.eachSeries)(outputs, function (output) {
          var data = output.amount;
          data = Buffer.concat([data, _this.createVarint(output.script.length), output.script]);
          return _this.getTrustedInputRaw_async(data).then(function () {
            // iteration (eachSeries) ended
            // TODO notify progress
            // deferred.notify("output");
          });
        }).then(function () {
          return _this.getTrustedInputRaw_async(locktime);
        });
      };

      var data = Buffer.concat([transaction.version, this.createVarint(inputs.length)]);
      return this.getTrustedInputRaw_async(data, indexLookup).then(processInputs).then(processOutputs);
    }
  }, {
    key: "getVarint",
    value: function getVarint(data, offset) {
      if (data[offset] < 0xfd) {
        return [data[offset], 1];
      }
      if (data[offset] === 0xfd) {
        return [(data[offset + 2] << 8) + data[offset + 1], 3];
      }
      if (data[offset] === 0xfe) {
        return [(data[offset + 4] << 24) + (data[offset + 3] << 16) + (data[offset + 2] << 8) + data[offset + 1], 5];
      }

      throw new Error("getVarint called with unexpected parameters");
    }
  }, {
    key: "startUntrustedHashTransactionInputRaw_async",
    value: function startUntrustedHashTransactionInputRaw_async(newTransaction, firstRound, transactionData) {
      var buffer = Buffer.alloc(5);
      buffer[0] = 0xe0;
      buffer[1] = 0x44;
      buffer[2] = firstRound ? 0x00 : 0x80;
      buffer[3] = newTransaction ? 0x00 : 0x80;
      buffer[4] = transactionData.length;
      buffer = Buffer.concat([buffer, transactionData], 5 + transactionData.length);
      return this.comm.exchange(buffer.toString("hex"), [0x9000]);
    }
  }, {
    key: "startUntrustedHashTransactionInput_async",
    value: function startUntrustedHashTransactionInput_async(newTransaction, transaction, inputs) {
      var _this2 = this;

      var data = Buffer.concat([transaction.version, this.createVarint(transaction.inputs.length)]);
      return this.startUntrustedHashTransactionInputRaw_async(newTransaction, true, data).then(function () {
        var i = 0;
        return (0, _utils.eachSeries)(transaction.inputs, function (input) {
          // TODO : segwit
          var prefix = void 0;
          if (inputs[i].trustedInput) {
            prefix = Buffer.alloc(2);
            prefix[0] = 0x01;
            prefix[1] = inputs[i].value.length;
          } else {
            prefix = Buffer.alloc(1);
            prefix[0] = 0x00;
          }
          data = Buffer.concat([prefix, inputs[i].value, _this2.createVarint(input.script.length)]);
          return _this2.startUntrustedHashTransactionInputRaw_async(newTransaction, false, data).then(function () {
            var scriptBlocks = [];
            var offset = 0;
            if (input.script.length === 0) {
              scriptBlocks.push(input.sequence);
            } else {
              while (offset !== input.script.length) {
                var blockSize = input.script.length - offset > MAX_SCRIPT_BLOCK ? MAX_SCRIPT_BLOCK : input.script.length - offset;
                if (offset + blockSize !== input.script.length) {
                  scriptBlocks.push(input.script.slice(offset, offset + blockSize));
                } else {
                  scriptBlocks.push(Buffer.concat([input.script.slice(offset, offset + blockSize), input.sequence]));
                }
                offset += blockSize;
              }
            }
            return (0, _utils.eachSeries)(scriptBlocks, function (scriptBlock) {
              return _this2.startUntrustedHashTransactionInputRaw_async(newTransaction, false, scriptBlock);
            }).then(function () {
              i++;
            });
          });
        });
      });
    }
  }, {
    key: "provideOutputFullChangePath_async",
    value: function provideOutputFullChangePath_async(path) {
      var paths = (0, _utils.splitPath)(path);
      var buffer = Buffer.alloc(5 + 1 + paths.length * 4);
      buffer[0] = 0xe0;
      buffer[1] = 0x4a;
      buffer[2] = 0xff;
      buffer[3] = 0x00;
      buffer[4] = 1 + paths.length * 4;
      buffer[5] = paths.length;
      paths.forEach(function (element, index) {
        buffer.writeUInt32BE(element, 6 + 4 * index);
      });
      return this.comm.exchange(buffer.toString("hex"), [0x9000]);
    }
  }, {
    key: "hashOutputFull_async",
    value: function hashOutputFull_async(outputScript) {
      var _this3 = this;

      var offset = 0;
      return (0, _utils.asyncWhile)(function () {
        return offset < outputScript.length;
      }, function () {
        var blockSize = offset + MAX_SCRIPT_BLOCK >= outputScript.length ? outputScript.length - offset : MAX_SCRIPT_BLOCK;
        var p1 = offset + blockSize === outputScript.length ? 0x80 : 0x00;
        var prefix = Buffer.alloc(5);
        prefix[0] = 0xe0;
        prefix[1] = 0x4a;
        prefix[2] = p1;
        prefix[3] = 0x00;
        prefix[4] = blockSize;
        var data = Buffer.concat([prefix, outputScript.slice(offset, offset + blockSize)]);
        return _this3.comm.exchange(data.toString("hex"), [0x9000]).then(function () {
          offset += blockSize;
        });
      });
    }
  }, {
    key: "signTransaction_async",
    value: function signTransaction_async(path) {
      var lockTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_LOCKTIME;
      var sigHashType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : SIGHASH_ALL;

      var paths = (0, _utils.splitPath)(path);
      var buffer = Buffer.alloc(5 + 1 + paths.length * 4 + 1 + 4 + 1);
      var offset = 0;
      buffer[offset++] = 0xe0;
      buffer[offset++] = 0x48;
      buffer[offset++] = 0x00;
      buffer[offset++] = 0x00;
      buffer[offset++] = 1 + paths.length * 4 + 1 + 4 + 1;
      buffer[offset++] = paths.length;
      paths.forEach(function (element) {
        buffer.writeUInt32BE(element, offset);
        offset += 4;
      });
      buffer[offset++] = 0x00; // authorization length
      buffer.writeUInt32LE(lockTime, offset);
      offset += 4;
      buffer[offset++] = sigHashType;
      return this.comm.exchange(buffer.toString("hex"), [0x9000]).then(function (signature) {
        var result = Buffer.from(signature, "hex");
        result[0] = 0x30;
        return result.slice(0, result.length - 2);
      });
    }
  }, {
    key: "signMessageNew_async",
    value: function signMessageNew_async(path, messageHex) {
      var _this4 = this;

      var paths = (0, _utils.splitPath)(path);
      var message = new Buffer(messageHex, "hex");
      var offset = 0;
      var apdus = [];

      var _loop = function _loop() {
        var maxChunkSize = offset === 0 ? MAX_SCRIPT_BLOCK - 1 - paths.length * 4 - 4 : MAX_SCRIPT_BLOCK;
        var chunkSize = offset + maxChunkSize > message.length ? message.length - offset : maxChunkSize;
        var buffer = new Buffer(offset === 0 ? 5 + 1 + paths.length * 4 + 2 + chunkSize : 5 + chunkSize);
        buffer[0] = 0xe0;
        buffer[1] = 0x4e;
        buffer[2] = 0x00;
        buffer[3] = offset === 0 ? 0x01 : 0x80;
        buffer[4] = offset === 0 ? 1 + paths.length * 4 + 2 + chunkSize : chunkSize;
        if (offset === 0) {
          buffer[5] = paths.length;
          paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 6 + 4 * index);
          });
          buffer.writeUInt16BE(message.length, 6 + 4 * paths.length);
          message.copy(buffer, 6 + 4 * paths.length + 2, offset, offset + chunkSize);
        } else {
          message.copy(buffer, 5, offset, offset + chunkSize);
        }
        apdus.push(buffer.toString("hex"));
        offset += chunkSize;
      };

      while (offset !== message.length) {
        _loop();
      }
      return (0, _utils.foreach)(apdus, function (apdu) {
        return _this4.comm.exchange(apdu, [0x9000]);
      }).then(function () {
        var buffer = Buffer.alloc(6);
        buffer[0] = 0xe0;
        buffer[1] = 0x4e;
        buffer[2] = 0x80;
        buffer[3] = 0x00;
        buffer[4] = 0x01;
        buffer[5] = 0x00;
        return _this4.comm.exchange(buffer.toString("hex"), [0x9000]).then(function (apduResponse) {
          var response = Buffer.from(apduResponse, "hex");
          var v = response[0] - 0x30;
          var r = response.slice(4, 4 + response[3]);
          if (r[0] === 0) {
            r = r.slice(1);
          }
          r = r.toString("hex");
          var offset = 4 + response[3] + 2;
          var s = response.slice(offset, offset + response[offset - 1]);
          if (s[0] === 0) {
            s = s.slice(1);
          }
          s = s.toString("hex");
          return { v: v, r: r, s: s };
        });
      });
    }
  }, {
    key: "createPaymentTransactionNew_async",
    value: function createPaymentTransactionNew_async(inputs, associatedKeysets, changePath, outputScriptHex) {
      var _this5 = this;

      var lockTime = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : DEFAULT_LOCKTIME;
      var sigHashType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : SIGHASH_ALL;

      // Inputs are provided as arrays of [transaction, output_index, optional redeem script, optional sequence]
      // associatedKeysets are provided as arrays of [path]
      var nullScript = Buffer.alloc(0);
      var nullPrevout = Buffer.alloc(0);
      var defaultVersion = Buffer.alloc(4);
      defaultVersion.writeUInt32LE(1, 0);
      var trustedInputs = [];
      var regularOutputs = [];
      var signatures = [];
      var publicKeys = [];
      var firstRun = true;
      var resuming = false;
      var targetTransaction = {
        inputs: [],
        version: defaultVersion
      };

      var outputScript = Buffer.from(outputScriptHex, "hex");

      return (0, _utils.foreach)(inputs, function (input) {
        return (0, _utils.doIf)(!resuming, function () {
          return _this5.getTrustedInput_async(input[1], input[0]).then(function (trustedInput) {
            trustedInputs.push({
              trustedInput: true,
              value: Buffer.from(trustedInput, "hex")
            });
          });
        }).then(function () {
          var outputs = input[0].outputs;

          var index = input[1];
          if (outputs && index <= outputs.length - 1) {
            regularOutputs.push(outputs[index]);
          }
        });
      }).then(function () {
        for (var i = 0; i < inputs.length; i++) {
          var _sequence = Buffer.alloc(4);
          _sequence.writeUInt32LE(inputs[i].length >= 4 && typeof inputs[i][3] === "number" ? inputs[i][3] : DEFAULT_SEQUENCE, 0);
          targetTransaction.inputs.push({
            script: nullScript,
            prevout: nullPrevout,
            sequence: _sequence
          });
        }
      }).then(function () {
        return (0, _utils.doIf)(!resuming, function () {
          return (
            // Collect public keys
            (0, _utils.foreach)(inputs, function (input, i) {
              return _this5.getWalletPublicKey_async(associatedKeysets[i]);
            }).then(function (result) {
              for (var index = 0; index < result.length; index++) {
                publicKeys.push(_this5.compressPublicKey(Buffer.from(result[index].publicKey, "hex")));
              }
            })
          );
        });
      }).then(function () {
        return (0, _utils.foreach)(inputs, function (input, i) {
          targetTransaction.inputs[i].script = inputs[i].length >= 3 && typeof inputs[i][2] === "string" ? Buffer.from(inputs[i][2], "hex") : regularOutputs[i].script;
          return _this5.startUntrustedHashTransactionInput_async(firstRun, targetTransaction, trustedInputs).then(function () {
            return Promise.resolve().then(function () {
              if (!resuming && typeof changePath !== "undefined") {
                return _this5.provideOutputFullChangePath_async(changePath);
              }
            }).then(function () {
              return _this5.hashOutputFull_async(outputScript);
            }).then(function () {
              return _this5.signTransaction_async(associatedKeysets[i], lockTime, sigHashType).then(function (signature) {
                signatures.push(signature);
                targetTransaction.inputs[i].script = nullScript;
                if (firstRun) {
                  firstRun = false;
                }
              });
            });
          });
        });
      }).then(function () {
        // Populate the final input scripts
        for (var i = 0; i < inputs.length; i++) {
          var signatureSize = Buffer.alloc(1);
          var keySize = Buffer.alloc(1);
          signatureSize[0] = signatures[i].length;
          keySize[0] = publicKeys[i].length;
          targetTransaction.inputs[i].script = Buffer.concat([signatureSize, signatures[i], keySize, publicKeys[i]]);
          targetTransaction.inputs[i].prevout = trustedInputs[i].value.slice(4, 4 + 0x24);
        }

        var lockTimeBuffer = Buffer.alloc(4);
        lockTimeBuffer.writeUInt32LE(lockTime, 0);

        var result = Buffer.concat([_this5.serializeTransaction(targetTransaction), outputScript, lockTimeBuffer]);

        return result.toString("hex");
      });
    }
  }, {
    key: "signP2SHTransaction_async",
    value: function signP2SHTransaction_async(inputs, associatedKeysets, outputScriptHex) {
      var _this6 = this;

      var lockTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_LOCKTIME;
      var sigHashType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : SIGHASH_ALL;

      // Inputs are provided as arrays of [transaction, output_index, redeem script, optional sequence]
      // associatedKeysets are provided as arrays of [path]
      var nullScript = Buffer.alloc(0);
      var nullPrevout = Buffer.alloc(0);
      var defaultVersion = Buffer.alloc(4);
      defaultVersion.writeUInt32LE(1, 0);
      var trustedInputs = [];
      var regularOutputs = [];
      var signatures = [];
      var firstRun = true;
      var resuming = false;
      var targetTransaction = {
        inputs: [],
        version: defaultVersion
      };

      var outputScript = Buffer.from(outputScriptHex, "hex");

      return (0, _utils.foreach)(inputs, function (input) {
        return (0, _utils.doIf)(!resuming, function () {
          return _this6.getTrustedInput_async(input[1], input[0]).then(function (trustedInput) {
            var inputItem = {};
            inputItem.trustedInput = false;
            inputItem.value = Buffer.from(trustedInput, "hex").slice(4, 4 + 0x24);
            trustedInputs.push(inputItem);
          });
        }).then(function () {
          var outputs = input[0].outputs;

          var index = input[1];
          if (outputs && index <= outputs.length - 1) {
            regularOutputs.push(outputs[index]);
          }
        });
      }).then(function () {
        // Pre-build the target transaction
        for (var i = 0; i < inputs.length; i++) {
          var tmp = Buffer.alloc(4);
          var _sequence2 = void 0;
          if (inputs[i].length >= 4 && typeof inputs[i][3] === "number") {
            _sequence2 = inputs[i][3];
          } else {
            _sequence2 = DEFAULT_SEQUENCE;
          }
          tmp.writeUInt32LE(_sequence2, 0);
          targetTransaction.inputs.push({
            prevout: nullPrevout,
            script: nullScript,
            sequence: tmp
          });
        }
      }).then(function () {
        return (0, _utils.foreach)(inputs, function (input, i) {
          targetTransaction.inputs[i].script = inputs[i].length >= 3 && typeof inputs[i][2] === "string" ? Buffer.from(inputs[i][2], "hex") : regularOutputs[i].script;
          return _this6.startUntrustedHashTransactionInput_async(firstRun, targetTransaction, trustedInputs).then(function () {
            return _this6.hashOutputFull_async(outputScript);
          }).then(function () {
            return _this6.signTransaction_async(associatedKeysets[i], lockTime, sigHashType).then(function (signature) {
              signatures.push(signature.slice(0, signature.length - 1).toString("hex"));
              targetTransaction.inputs[i].script = nullScript;
              if (firstRun) {
                firstRun = false;
              }
            });
          });
        });
      }).then(function () {
        return signatures;
      });
    }
  }, {
    key: "compressPublicKey",
    value: function compressPublicKey(publicKey) {
      var prefix = (publicKey[64] & 1) !== 0 ? 0x03 : 0x02;
      var prefixBuffer = Buffer.alloc(1);
      prefixBuffer[0] = prefix;
      return Buffer.concat([prefixBuffer, publicKey.slice(1, 1 + 32)]);
    }
  }, {
    key: "createVarint",
    value: function createVarint(value) {
      if (value < 0xfd) {
        var _buffer = Buffer.alloc(1);
        _buffer[0] = value;
        return _buffer;
      }
      if (value <= 0xffff) {
        var _buffer2 = Buffer.alloc(3);
        _buffer2[0] = 0xfd;
        _buffer2[1] = value & 0xff;
        _buffer2[2] = value >> 8 & 0xff;
        return _buffer2;
      }
      var buffer = Buffer.alloc(5);
      buffer[0] = 0xfe;
      buffer[1] = value & 0xff;
      buffer[2] = value >> 8 & 0xff;
      buffer[3] = value >> 16 & 0xff;
      buffer[4] = value >> 24 & 0xff;
      return buffer;
    }
  }, {
    key: "splitTransaction",
    value: function splitTransaction(transactionHex) {
      var inputs = [];
      var outputs = [];
      var offset = 0;
      var transaction = Buffer.from(transactionHex, "hex");
      var version = transaction.slice(offset, offset + 4);
      offset += 4;
      var varint = this.getVarint(transaction, offset);
      var numberInputs = varint[0];
      offset += varint[1];
      for (var i = 0; i < numberInputs; i++) {
        var _prevout = transaction.slice(offset, offset + 36);
        offset += 36;
        varint = this.getVarint(transaction, offset);
        offset += varint[1];
        var _script = transaction.slice(offset, offset + varint[0]);
        offset += varint[0];
        var _sequence3 = transaction.slice(offset, offset + 4);
        offset += 4;
        inputs.push({ prevout: _prevout, script: _script, sequence: _sequence3 });
      }
      varint = this.getVarint(transaction, offset);
      var numberOutputs = varint[0];
      offset += varint[1];
      for (var _i = 0; _i < numberOutputs; _i++) {
        var _amount = transaction.slice(offset, offset + 8);
        offset += 8;
        varint = this.getVarint(transaction, offset);
        offset += varint[1];
        var _script2 = transaction.slice(offset, offset + varint[0]);
        offset += varint[0];
        outputs.push({ amount: _amount, script: _script2 });
      }
      var locktime = transaction.slice(offset, offset + 4);
      return { version: version, inputs: inputs, outputs: outputs, locktime: locktime };
    }
  }, {
    key: "serializeTransactionOutputs",
    value: function serializeTransactionOutputs(_ref) {
      var _this7 = this;

      var outputs = _ref.outputs;

      var outputBuffer = Buffer.alloc(0);
      if (typeof outputs !== "undefined") {
        outputBuffer = Buffer.concat([outputBuffer, this.createVarint(outputs.length)]);
        outputs.forEach(function (output) {
          outputBuffer = Buffer.concat([outputBuffer, output.amount, _this7.createVarint(output.script.length), output.script]);
        });
      }
      return outputBuffer;
    }
  }, {
    key: "serializeTransaction",
    value: function serializeTransaction(transaction) {
      var _this8 = this;

      var inputBuffer = Buffer.alloc(0);
      transaction.inputs.forEach(function (input) {
        inputBuffer = Buffer.concat([inputBuffer, input.prevout, _this8.createVarint(input.script.length), input.script, input.sequence]);
      });

      var outputBuffer = this.serializeTransactionOutputs(transaction);
      if (typeof transaction.outputs !== "undefined" && typeof transaction.locktime !== "undefined") {
        outputBuffer = Buffer.concat([outputBuffer, transaction.locktime]);
      }

      return Buffer.concat([transaction.version, this.createVarint(transaction.inputs.length), inputBuffer, outputBuffer]);
    }
  }, {
    key: "displayTransactionDebug",
    value: function displayTransactionDebug(transaction) {
      console.log("version " + transaction.version.toString("hex"));
      transaction.inputs.forEach(function (input, i) {
        var prevout = input.prevout.toString("hex");
        var script = input.script.toString("hex");
        var sequence = input.sequence.toString("hex");
        console.log("input " + i + " prevout " + prevout + " script " + script + " sequence " + sequence);
      });
      (transaction.outputs || []).forEach(function (output, i) {
        var amount = output.amount.toString("hex");
        var script = output.script.toString("hex");
        console.log("output " + i + " amount " + amount + " script " + script);
      });
      if (typeof transaction.locktime !== "undefined") {
        console.log("locktime " + transaction.locktime.toString("hex"));
      }
    }
  }]);

  return LedgerBtc;
}();

exports.default = LedgerBtc;