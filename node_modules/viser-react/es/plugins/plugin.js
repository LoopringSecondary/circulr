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
import * as viser from 'viser';
var PluginComponent = (function (_super) {
    __extends(PluginComponent, _super);
    function PluginComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.config = {};
        _this.centralizedUpdates = function (unit) {
            var config = _this.config;
            var props = unit.props;
            var displayName = unit.displayName;
            if (displayName === 'Slider') {
                var container = props.container;
                if (!container || !document.getElementById(container)) {
                    props.container = unit.state.containerId;
                }
            }
            _this.combineContentConfig(displayName, props, config);
        };
        _this.portalRef = function (container) {
            if (!_this.container) {
                _this.container = container;
            }
        };
        return _this;
    }
    PluginComponent.prototype.getChildContext = function () {
        return {
            centralizedUpdates: this.centralizedUpdates
        };
    };
    PluginComponent.prototype.combineContentConfig = function (displayName, props, config) {
        var nameLowerCase = displayName.toLowerCase();
        config[nameLowerCase] = props;
    };
    PluginComponent.prototype.createSliderInstance = function (config) {
        viser.Plugin(config);
    };
    PluginComponent.prototype.clearConfigData = function () {
        this.config = {};
    };
    PluginComponent.prototype.componentDidMount = function () {
        this.createSliderInstance(this.config);
        this.clearConfigData();
    };
    PluginComponent.prototype.render = function () {
        return React.createElement("div", { ref: this.portalRef }, this.props.children);
    };
    PluginComponent.childContextTypes = {
        centralizedUpdates: PropTypes.func
    };
    return PluginComponent;
}(React.Component));
export default PluginComponent;
//# sourceMappingURL=plugin.js.map