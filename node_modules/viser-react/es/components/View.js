var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
var isReact16 = ReactDOM.createPortal !== undefined;
function generateRandomNum() {
    return (Math.floor(new Date().getTime() + Math.random() * 10000)).toString();
}
var View = (function (_super) {
    __extends(View, _super);
    function View(props) {
        var _this = _super.call(this, props) || this;
        _this.displayName = 'View';
        _this.state = {
            hasInViews: true,
            viewId: _this.props.viewId || generateRandomNum()
        };
        return _this;
    }
    View.prototype.getChildContext = function () {
        return {
            hasInViews: this.state.hasInViews,
            viewId: this.state.viewId
        };
    };
    View.prototype.componentDidUpdate = function () {
        this.context.centralizedUpdates(this);
    };
    View.prototype.componentDidMount = function () {
        this.context.centralizedUpdates(this);
    };
    View.prototype.render = function () {
        if (isReact16) {
            return this.props.children;
        }
        else {
            return React.Children.only(this.props.children);
        }
    };
    View.childContextTypes = {
        hasInViews: PropTypes.bool,
        viewId: PropTypes.string
    };
    View.contextTypes = {
        centralizedUpdates: PropTypes.func,
        hasInViews: PropTypes.bool
    };
    return View;
}(React.Component));
export default View;
//# sourceMappingURL=View.js.map