/*
 * Copyright 2018, Alibaba Group.
 * Copyrights licensed under the BSD License.
 * See the accompanying LICENSE file for terms.
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var intl = _interopDefault(require('intl'));
var React = _interopDefault(require('react'));
var IntlMessageFormat = _interopDefault(require('intl-messageformat'));
var escapeHtml = _interopDefault(require('escape-html'));
var cookie = _interopDefault(require('cookie'));
var queryParser = _interopDefault(require('querystring'));
var load = _interopDefault(require('load-script'));
var invariant = _interopDefault(require('invariant'));
require('console-polyfill');
var merge = _interopDefault(require('lodash.merge'));
var isElectron = _interopDefault(require('is-electron'));

/**
 * Currency code list
 * https://www.currency-iso.org/en/home/tables/table-a1.html
 */
var currency = ["AFN", "EUR", "ALL", "DZD", "USD", "AOA", "XCD", "ARS", "AMD", "AWG", "AUD", "AZN", "BSD", "BHD", "BDT", "BBD", "BYN", "BZD", "XOF", "BMD", "INR", "BTN", "BOB", "BOV", "BAM", "BWP", "NOK", "BRL", "BND", "BGN", "BIF", "CVE", "KHR", "XAF", "CAD", "KYD", "CLP", "CLF", "CNY", "COP", "COU", "KMF", "CDF", "NZD", "CRC", "HRK", "CUP", "CUC", "ANG", "CZK", "DKK", "DJF", "DOP", "EGP", "SVC", "ERN", "ETB", "FKP", "FJD", "XPF", "GMD", "GEL", "GHS", "GIP", "GTQ", "GBP", "GNF", "GYD", "HTG", "HNL", "HKD", "HUF", "ISK", "IDR", "XDR", "IRR", "IQD", "ILS", "JMD", "JPY", "JOD", "KZT", "KES", "KPW", "KRW", "KWD", "KGS", "LAK", "LBP", "LSL", "ZAR", "LRD", "LYD", "CHF", "MOP", "MKD", "MGA", "MWK", "MYR", "MVR", "MRO", "MUR", "XUA", "MXN", "MXV", "MDL", "MNT", "MAD", "MZN", "MMK", "NAD", "NPR", "NIO", "NGN", "OMR", "PKR", "PAB", "PGK", "PYG", "PEN", "PHP", "PLN", "QAR", "RON", "RUB", "RWF", "SHP", "WST", "STD", "SAR", "RSD", "SCR", "SLL", "SGD", "XSU", "SBD", "SOS", "SSP", "LKR", "SDG", "SRD", "SZL", "SEK", "CHE", "CHW", "SYP", "TWD", "TJS", "TZS", "THB", "TOP", "TTD", "TND", "TRY", "TMT", "UGX", "UAH", "AED", "USN", "UYU", "UYI", "UZS", "VUV", "VEF", "VND", "YER", "ZMW", "ZWL", "XBA", "XBB", "XBC", "XBD", "XTS", "XXX", "XAU", "XPD", "XPT", "XAG"];

var numberFormat = {};

for (var i = 0; i < currency.length; i++) {
  numberFormat[currency[i]] = {
    style: 'currency',
    currency: currency[i]
  };
}

var defaultFormats = {
  number: numberFormat
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var COMMON_LOCALE_DATA_URLS = {
  en: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/en.js",
  zh: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/zh.js",
  fr: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/fr.js",
  ja: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/ja.js",
  de: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/de.js",
  es: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/es.js",
  ko: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/ko.js",
  pt: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/pt.js",
  it: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/it.js",
  ru: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/ru.js",
  pl: "https://g.alicdn.com/react-intl-universal/locale-data/1.0.0/pl.js"
};

var isBrowser = !isElectron() && typeof window !== "undefined";

String.prototype.defaultMessage = String.prototype.d = function (msg) {
  return this || msg || "";
};

var ReactIntlUniversal = function () {
  function ReactIntlUniversal() {
    classCallCheck(this, ReactIntlUniversal);

    this.options = {
      currentLocale: null, // Current locale such as 'en-US'
      urlLocaleKey: null, // URL's query Key to determine locale. Example: if URL=http://localhost?lang=en-US, then set it 'lang'
      cookieLocaleKey: null, // Cookie's Key to determine locale. Example: if cookie=lang:en-US, then set it 'lang'
      locales: {}, // app locale data like {"en-US":{"key1":"value1"},"zh-CN":{"key1":"值1"}}
      warningHandler: console.warn // ability to accumulate missing messages using third party services like Sentry
    };
  }

  /**
   * Get the formatted message by key
   * @param {string} key The string representing key in locale data file
   * @param {Object} variables Variables in message
   * @returns {string} message
   */


  createClass(ReactIntlUniversal, [{
    key: "get",
    value: function get$$1(key, variables) {
      invariant(key, "key is required");
      var _options = this.options,
          locales = _options.locales,
          currentLocale = _options.currentLocale,
          formats = _options.formats;


      if (!locales || !locales[currentLocale]) {
        return "";
      }
      var msg = this.getDescendantProp(locales[currentLocale], key);
      if (msg == null) {
        this.options.warningHandler("react-intl-universal key \"" + key + "\" not defined in " + currentLocale);
        return "";
      }
      if (variables) {
        variables = Object.assign({}, variables);
        // HTML message with variables. Escape it to avoid XSS attack.
        for (var i in variables) {
          var value = variables[i];
          if (typeof value === "string" && value.indexOf("<") >= 0 && value.indexOf(">") >= 0) {
            value = escapeHtml(value);
          }
          variables[i] = value;
        }
      }

      try {
        msg = new IntlMessageFormat(msg, currentLocale, formats); // TODO memorize
        msg = msg.format(variables);
        return msg;
      } catch (err) {
        this.options.warningHandler("react-intl-universal format message failed for key='" + key + "'", err);
        return "";
      }
    }

    /**
     * Get the formatted html message by key.
     * @param {string} key The string representing key in locale data file
     * @param {Object} variables Variables in message
     * @returns {React.Element} message
    */

  }, {
    key: "getHTML",
    value: function getHTML(key, variables) {
      var msg = this.get(key, variables);
      if (msg) {
        var el = React.createElement("span", {
          dangerouslySetInnerHTML: {
            __html: msg
          }
        });
        // when key exists, it should still return element if there's defaultMessage() after getHTML()
        var defaultMessage = function defaultMessage() {
          return el;
        };
        return Object.assign({ defaultMessage: defaultMessage, d: defaultMessage }, el);
      }
      return "";
    }

    /**
     * As same as get(...) API
     * @param {Object} options 
     * @param {string} options.id 
     * @param {string} options.defaultMessage
     * @param {Object} variables Variables in message
     * @returns {string} message
    */

  }, {
    key: "formatMessage",
    value: function formatMessage(messageDescriptor, variables) {
      var id = messageDescriptor.id,
          defaultMessage = messageDescriptor.defaultMessage;

      return this.get(id, variables).defaultMessage(defaultMessage);
    }

    /**
     * As same as getHTML(...) API
     * @param {Object} options 
     * @param {string} options.id 
     * @param {React.Element} options.defaultMessage
     * @param {Object} variables Variables in message
     * @returns {React.Element} message
    */

  }, {
    key: "formatHTMLMessage",
    value: function formatHTMLMessage(messageDescriptor, variables) {
      var id = messageDescriptor.id,
          defaultMessage = messageDescriptor.defaultMessage;

      return this.getHTML(id, variables).defaultMessage(defaultMessage);
    }

    /**
     * Helper: determine user's locale via URL, cookie, and browser's language.
     * You may not this API, if you have other rules to determine user's locale.
     * @param {string} options.urlLocaleKey URL's query Key to determine locale. Example: if URL=http://localhost?lang=en-US, then set it 'lang'
     * @param {string} options.cookieLocaleKey Cookie's Key to determine locale. Example: if cookie=lang:en-US, then set it 'lang'
     * @returns {string} determined locale such as 'en-US'
     */

  }, {
    key: "determineLocale",
    value: function determineLocale() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return this.getLocaleFromURL(options) || this.getLocaleFromCookie(options) || this.getLocaleFromBrowser();
    }

    /**
     * Initialize properties and load CLDR locale data according to currentLocale
     * @param {Object} options
     * @param {string} options.currentLocale Current locale such as 'en-US'
     * @param {string} options.locales App locale data like {"en-US":{"key1":"value1"},"zh-CN":{"key1":"值1"}}
     * @returns {Promise}
     */

  }, {
    key: "init",
    value: function init() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      invariant(options.currentLocale, "options.currentLocale is required");
      invariant(options.locales, "options.locales is required");

      Object.assign(this.options, options);

      this.options.formats = Object.assign({}, this.options.formats, defaultFormats);

      return new Promise(function (resolve, reject) {

        var lang = _this.options.currentLocale.split('-')[0].split('_')[0];
        var langUrl = COMMON_LOCALE_DATA_URLS[lang];
        if (isBrowser) {
          if (langUrl) {
            load(langUrl, function (err, script) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          } else {
            _this.options.warningHandler("lang \"" + lang + "\" is not supported.");
            resolve();
          }
        } else {
          // For Node.js, common locales are added in the application
          resolve();
        }
      });
    }

    /**
     * Get the inital options 
     */

  }, {
    key: "getInitOptions",
    value: function getInitOptions() {
      return this.options;
    }

    /**
     * Load more locales after init
     */

  }, {
    key: "load",
    value: function load$$1(locales) {
      merge(this.options.locales, locales);
    }
  }, {
    key: "getLocaleFromCookie",
    value: function getLocaleFromCookie(options) {
      var cookieLocaleKey = options.cookieLocaleKey;

      if (cookieLocaleKey) {
        var params = cookie.parse(document.cookie);
        return params && params[cookieLocaleKey];
      }
    }
  }, {
    key: "getLocaleFromURL",
    value: function getLocaleFromURL(options) {
      var urlLocaleKey = options.urlLocaleKey;

      if (urlLocaleKey) {
        var query = location.search.split("?");
        if (query.length >= 2) {
          var params = queryParser.parse(query[1]);
          return params && params[urlLocaleKey];
        }
      }
    }
  }, {
    key: "getDescendantProp",
    value: function getDescendantProp(locale, key) {

      if (locale[key]) {
        return locale[key];
      }

      var msg = key.split(".").reduce(function (a, b) {
        return a != undefined ? a[b] : a;
      }, locale);

      return msg;
    }
  }, {
    key: "getLocaleFromBrowser",
    value: function getLocaleFromBrowser() {
      return navigator.language || navigator.userLanguage;
    }
  }]);
  return ReactIntlUniversal;
}();

module.exports = new ReactIntlUniversal();
