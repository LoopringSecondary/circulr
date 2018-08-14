'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var PropTypes = _interopRequireWildcard(_propTypes);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var ReactDOM = _interopRequireWildcard(_reactDom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var isReact16 = ReactDOM.createPortal !== undefined;
function generateRandomNum() {
    return Math.floor(new Date().getTime() + Math.random() * 10000).toString();
}
var FacetView = function (_super) {
    __extends(FacetView, _super);
    function FacetView(props) {
        var _this = _super.call(this, props) || this;
        _this.displayName = 'FacetView';
        _this.state = {
            hasInViews: true,
            viewId: _this.props.viewId || generateRandomNum(),
            viewType: 'facet'
        };
        return _this;
    }
    FacetView.prototype.getChildContext = function () {
        return {
            hasInViews: this.state.hasInViews,
            viewId: this.state.viewId,
            viewType: this.state.viewType
        };
    };
    FacetView.prototype.componentDidUpdate = function () {
        this.context.centralizedUpdates(this);
    };
    FacetView.prototype.componentDidMount = function () {
        this.context.centralizedUpdates(this);
    };
    FacetView.prototype.render = function () {
        if (isReact16) {
            return this.props.children;
        } else {
            return React.Children.only(this.props.children);
        }
    };
    FacetView.childContextTypes = {
        hasInViews: PropTypes.bool,
        viewId: PropTypes.string,
        viewType: PropTypes.string
    };
    FacetView.contextTypes = {
        centralizedUpdates: PropTypes.func,
        hasInViews: PropTypes.bool,
        viewType: PropTypes.string
    };
    return FacetView;
}(React.Component);
exports.default = FacetView;
//# sourceMappingURL=FacetView.js.map