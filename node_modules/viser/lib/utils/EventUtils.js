"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isEmpty2 = require("lodash/isEmpty");

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

exports.setSEvent = setSEvent;
exports.setEvent = setEvent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regEventName = /on(.+)(MouseEnter|MouseMove|MouseLeave|Click|DdlClick|MouseDown|MouseUp|TouchStart|TouchMove|TouchEnd)/;
function setSEvent(chart, itemname, keyname, content) {
    if ((0, _isEmpty3.default)(keyname)) {
        return;
    }
    var parseEventItem = regEventName.exec(keyname);
    if (!parseEventItem || parseEventItem.length <= 2) {
        return;
    }
    var lowerEventItem = parseEventItem[1].toLowerCase();
    var lowerEventName = parseEventItem[2].toLowerCase();
    var eventItem = itemname + "-" + lowerEventItem;
    chart.on(eventItem + ":" + lowerEventName, function (ev) {
        if (content) {
            content(ev, chart);
        }
    });
}
function setEvent(chart, name, item) {
    if ((0, _isEmpty3.default)(item)) {
        return;
    }
    var events = Object.keys(item).filter(function (entry) {
        return (/^on/.test(entry)
        );
    });
    if ((0, _isEmpty3.default)(events)) {
        return;
    }
    events.forEach(function (entry) {
        var eventName = entry.slice(2, entry.length);
        var eventLowerCase = eventName.toLowerCase();
        var content = item[entry];
        if (name) {
            chart.on(name + ":" + eventLowerCase, function (ev) {
                if (content) {
                    content(ev, chart);
                }
            });
        } else {
            chart.on(eventLowerCase, function (ev) {
                if (content) {
                    content(ev, chart);
                }
            });
        }
    });
}
//# sourceMappingURL=EventUtils.js.map