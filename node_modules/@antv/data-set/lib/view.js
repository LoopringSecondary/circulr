function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('wolfy87-eventemitter');
var assign = require('lodash/assign');
var clone = require('lodash/clone');
var cloneDeep = require('lodash/cloneDeep');
var find = require('lodash/find');
var forIn = require('lodash/forIn');
var isArray = require('lodash/isArray');
var isMatch = require('lodash/isMatch');
var isObject = require('lodash/isObject');
var isString = require('lodash/isString');
var keys = require('lodash/keys');
var pick = require('lodash/pick');

var View = function (_EventEmitter) {
  _inherits(View, _EventEmitter);

  // constructor
  function View(dataSet, options) {
    _classCallCheck(this, View);

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    var me = _this;
    options = options || {};
    dataSet = dataSet || {};
    if (!dataSet.isDataSet) {
      options = dataSet;
      dataSet = null;
    }
    assign(me, {
      dataSet: dataSet,
      loose: !dataSet,
      dataType: 'table',
      isView: true,
      isDataView: true, // alias
      origin: [],
      rows: [],
      transforms: [],
      watchingStates: null
    }, options);
    if (!me.loose) {
      var watchingStates = me.watchingStates;

      dataSet.on('statechange', function (name) {
        if (isArray(watchingStates)) {
          if (watchingStates.indexOf(name) > -1) {
            me._reExecute();
          }
        } else {
          me._reExecute();
        }
      });
    }
    return _this;
  }

  View.prototype._parseStateExpression = function _parseStateExpression(expr) {
    var dataSet = this.dataSet;
    var matched = /^\$state\.(\w+)/.exec(expr);
    if (matched) {
      return dataSet.state[matched[1]];
    }
    return expr;
  };

  View.prototype._preparseOptions = function _preparseOptions(options) {
    var me = this;
    var optionsCloned = clone(options);
    if (me.loose) {
      return optionsCloned;
    }
    forIn(optionsCloned, function (value, key) {
      if (isString(value) && /^\$state\./.test(value)) {
        optionsCloned[key] = me._parseStateExpression(value);
      }
    });
    return optionsCloned;
  };

  // connectors


  View.prototype._prepareSource = function _prepareSource(source, options) {
    var me = this;
    var DataSet = View.DataSet;
    // warning me.origin is protected
    me._source = {
      source: source,
      options: options
    };
    if (!options) {
      if (source instanceof View || isString(source)) {
        me.origin = DataSet.getConnector('default')(source, me.dataSet);
      } else if (isArray(source)) {
        // TODO branch: if source is like ['dataview1', 'dataview2']
        me.origin = source;
      } else if (isObject(source) && source.type) {
        options = me._preparseOptions(source); // connector without source
        me.origin = DataSet.getConnector(options.type)(options, me);
      } else {
        throw new TypeError('Invalid source');
      }
    } else {
      options = me._preparseOptions(options);
      me.origin = DataSet.getConnector(options.type)(source, options, me);
    }
    me.rows = cloneDeep(me.origin);
    return me;
  };

  View.prototype.source = function source(_source, options) {
    var me = this;
    me._prepareSource(_source, options);
    me._reExecuteTransforms();
    me.trigger('change');
    return me;
  };

  // transforms


  View.prototype.transform = function transform() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var me = this;
    me.transforms.push(options);
    me._executeTransform(options);
    return me;
  };

  View.prototype._executeTransform = function _executeTransform(options) {
    var me = this;
    options = me._preparseOptions(options);
    var transform = View.DataSet.getTransform(options.type);
    transform(me, options);
  };

  View.prototype._reExecuteTransforms = function _reExecuteTransforms() {
    var me = this;
    me.transforms.forEach(function (options) {
      me._executeTransform(options);
    });
  };

  // rows


  View.prototype.addRow = function addRow(row) {
    this.rows.push(row);
  };

  View.prototype.removeRow = function removeRow(index) {
    this.rows.splice(index, 1);
  };

  View.prototype.updateRow = function updateRow(index, newRow) {
    assign(this.rows[index], newRow);
  };

  View.prototype.findRows = function findRows(query) {
    return this.rows.filter(function (row) {
      return isMatch(row, query);
    });
  };

  View.prototype.findRow = function findRow(query) {
    return find(this.rows, query);
  };

  // columns


  View.prototype.getColumnNames = function getColumnNames() {
    var firstRow = this.rows[0];
    if (firstRow) {
      return keys(firstRow);
    }
    return [];
  };

  View.prototype.getColumnName = function getColumnName(index) {
    return this.getColumnNames()[index];
  };

  View.prototype.getColumnIndex = function getColumnIndex(columnName) {
    var columnNames = this.getColumnNames();
    return columnNames.indexOf(columnName);
  };

  View.prototype.getColumn = function getColumn(columnName) {
    return this.rows.map(function (row) {
      return row[columnName];
    });
  };

  View.prototype.getColumnData = function getColumnData(columnName) {
    return this.getColumn(columnName);
  };

  // data process


  View.prototype.getSubset = function getSubset(startRowIndex, endRowIndex, columnNames) {
    var subset = [];
    for (var i = startRowIndex; i <= endRowIndex; i++) {
      subset.push(pick(this.rows[i], columnNames));
    }
    return subset;
  };

  View.prototype.toString = function toString(prettyPrint) {
    var me = this;
    if (prettyPrint) {
      return JSON.stringify(me.rows, null, 2);
    }
    return JSON.stringify(me.rows);
  };

  View.prototype._reExecute = function _reExecute() {
    var me = this;
    var _me$_source = me._source,
        source = _me$_source.source,
        options = _me$_source.options;

    me._prepareSource(source, options);
    me._reExecuteTransforms();
    me.trigger('change');
  };

  return View;
}(EventEmitter);

module.exports = View;