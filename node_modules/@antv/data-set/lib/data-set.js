function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assign = require('lodash/assign');
var isNil = require('lodash/isNil');
var isObject = require('lodash/isObject');
var uniqueId = require('lodash/uniqueId');
var EventEmitter = require('wolfy87-eventemitter');
var View = require('./view');
var CONSTANTS = require('./constants');

var DataSet = function (_EventEmitter) {
  _inherits(DataSet, _EventEmitter);

  function DataSet() {
    var initialProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { state: {} };

    _classCallCheck(this, DataSet);

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    var me = _this;
    assign(me, {
      _onChangeTimer: null,
      DataSet: DataSet,
      isDataSet: true,
      views: {}
    }, initialProps);
    return _this;
  }

  DataSet.prototype._getUniqueViewName = function _getUniqueViewName() {
    var me = this;
    var name = uniqueId('view_');
    while (me.views[name]) {
      name = uniqueId('view_');
    }
    return name;
  };

  DataSet.prototype.createView = function createView(name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var me = this;
    if (isNil(name)) {
      name = me._getUniqueViewName();
    }
    if (isObject(name)) {
      options = name;
      name = me._getUniqueViewName();
    }
    if (me.views[name]) {
      throw new Error('data view exists: ' + name);
    }
    var view = new View(me, options);
    me.views[name] = view;
    return view;
  };

  DataSet.prototype.getView = function getView(name) {
    return this.views[name];
  };

  DataSet.prototype.setView = function setView(name, view) {
    this.views[name] = view;
  };

  DataSet.prototype.setState = function setState(name, value) {
    var me = this;
    me.state[name] = value;
    if (me._onChangeTimer) {
      clearTimeout(me._onChangeTimer);
      me._onChangeTimer = null;
    }
    me._onChangeTimer = setTimeout(function () {
      me.emit('statechange', name, value);
    }, 16); // execute after one frame
  };

  return DataSet;
}(EventEmitter);

assign(DataSet, {
  CONSTANTS: CONSTANTS,
  DataSet: DataSet,
  DataView: View, // alias
  View: View,
  connectors: {},
  transforms: {},

  registerConnector: function registerConnector(name, connector) {
    DataSet.connectors[name] = connector;
  },
  getConnector: function getConnector(name) {
    return DataSet.connectors[name] || DataSet.connectors.default;
  },
  registerTransform: function registerTransform(name, transform) {
    DataSet.transforms[name] = transform;
  },
  getTransform: function getTransform(name) {
    return DataSet.transforms[name] || DataSet.transforms.default;
  }
}, CONSTANTS);

View.DataSet = DataSet;
assign(DataSet.prototype, {
  view: DataSet.prototype.createView // alias
});

DataSet.version = '____DATASET_VERSION____';

module.exports = DataSet;