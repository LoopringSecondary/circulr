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
function generateRandomNum() {
    return (Math.floor(new Date().getTime() + Math.random() * 10000)).toString();
}
var Props = (function () {
    function Props() {
    }
    return Props;
}());
var SubPlugin = (function (_super) {
    __extends(SubPlugin, _super);
    function SubPlugin(props) {
        var _this = _super.call(this, props) || this;
        _this.displayName = 'SubPlugin';
        _this.state = {
            containerId: 'viser-slider-' + generateRandomNum()
        };
        return _this;
    }
    SubPlugin.prototype.getChildContext = function () {
        return {
            containerId: this.state.containerId
        };
    };
    SubPlugin.prototype.componentDidUpdate = function () {
        this.context.centralizedUpdates(this);
    };
    SubPlugin.prototype.componentDidMount = function () {
        this.context.centralizedUpdates(this);
    };
    SubPlugin.prototype.render = function () {
        var containerId = this.state.containerId;
        return React.createElement("div", { id: containerId });
    };
    SubPlugin.childContextTypes = {
        containerId: PropTypes.string
    };
    SubPlugin.contextTypes = {
        centralizedUpdates: PropTypes.func
    };
    return SubPlugin;
}(React.Component));
var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Slider';
        return _this;
    }
    return Slider;
}(SubPlugin));
export { Slider };
//# sourceMappingURL=SubPlugin.js.map