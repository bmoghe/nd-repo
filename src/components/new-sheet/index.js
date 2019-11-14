/* eslint-disable */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var agGridReact = require('ag-grid-react');
var antd = require('antd');
var crypto = _interopDefault(require('crypto'));
var axios = _interopDefault(require('axios'));
var lodash = require('lodash');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var normalGridOptions = {
  headerHeight: 28,
  rowHeight: 28
};

var SheetContext = React.createContext({});

var Table = function Table(props) {
  var onShowSizeChange = props.onShowSizeChange,
    onPageChange = props.onPageChange,
    pageConfig = props.pageConfig;

  var _useContext = React.useContext(SheetContext),
    gridData = _useContext.gridData;

  var columnDefs = gridData.columnDefs,
    rowData = gridData.rowData,
    totalRows = gridData.totalRows;

  if (columnDefs && rowData) {
    if (columnDefs && rowData && columnDefs.length && rowData.length) {
      return React__default.createElement("div", {
        className: "ag-theme-balham table-container",
        style: {
          height: '93%',
          width: '100%'
        }
      }, React__default.createElement(agGridReact.AgGridReact, {
        gridOptions: normalGridOptions,
        columnDefs: columnDefs,
        rowData: rowData
      }), React__default.createElement("div", {
        className: "table-pagination"
      }, React__default.createElement("div", {
        className: "table-total-rows"
      }, "Total ", totalRows, " rows"), React__default.createElement(antd.Pagination, {
        showSizeChanger: true,
        showQuickJumper: true,
        size: 'small',
        defaultCurrent: pageConfig.page,
        defaultPageSize: pageConfig.plimit,
        pageSizeOptions: ['20', '50', '100'],
        onShowSizeChange: onShowSizeChange,
        onChange: onPageChange,
        total: totalRows
      })));
    }
  }

  return React__default.createElement("div", {
    className: "table-container"
  }, "No Data");
};
Table.propTypes = {
  gridData: PropTypes.object,
  onShowSizeChange: PropTypes.func,
  onPageChange: PropTypes.func,
  pageConfig: PropTypes.object
};
Table.defaultProps = {
  gridData: {
    columnDefs: [],
    rowData: []
  }
};

var Chart = function Chart(props) {
  return React__default.createElement("div", {
    className: "chart-container"
  }, "Chart");
};
Chart.propTypes = {
  request: PropTypes.object
};

var SHEET_DATA = '/ispring/client/v2/discovery/process/sheetdata';

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.



var rng = function nodeRNG() {
  return crypto.randomBytes(16);
};

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]]).join('');
}

var bytesToUuid_1 = bytesToUuid;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

var getTableData = function getTableData(request, accessToken) {
  var apiRequest = _objectSpread2({}, request);

  apiRequest.requestID = v4_1().toUpperCase();
  apiRequest.serviceName = 'ExecuteBIObjectData'; // TODO Remove access token from url as it handled axois interceptor.

  return axios("".concat(SHEET_DATA, "?accessToken=").concat(accessToken), {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    },
    data: JSON.stringify(apiRequest)
  });
};

var convertTableData = function convertTableData(response, dimensionList) {
  // object to construct and returned
  var result = {
    rowData: [],
    columnDefs: []
  };
  var fields = lodash.get(response, 'metaData.fields', []);
  var fieldsLength = fields.length;
  var headersArray = []; // add all headers

  for (var index = 0; index < fieldsLength; index++) {
    // get header name
    var name = fields[index].name;
    var headerId = lodash.split(name, '|')[0] || '';
    var dimension = lodash.find(dimensionList, {
      'id': headerId
    });
    var headerName = !lodash.isEmpty(dimension) && (dimension.name || dimension.attributeName) || '';

    if (headerName) {
      // push header in columnDefs
      result.columnDefs.push({
        headerName: headerName,
        'field': headerId
      });
      headersArray.push(headerId);
    }
  }

  var data = lodash.get(response, 'data', []);
  var dataLength = data.length;

  for (var _index = 0; _index < dataLength; _index++) {
    var itemData = data[_index];
    var itemDataLength = itemData.length;
    var dataObj = {};

    for (var i = 0; i < itemDataLength; i++) {
      dataObj[headersArray[i]] = itemData[i];
    }

    result.rowData.push(dataObj);
  }

  return result;
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var numeral = createCommonjsModule(function (module) {
  /*! @preserve
   * numeral.js
   * version : 2.0.6
   * author : Adam Draper
   * license : MIT
   * http://adamwdraper.github.com/Numeral-js/
   */

  (function (global, factory) {
    if ( module.exports) {
      module.exports = factory();
    } else {
      global.numeral = factory();
    }
  }(commonjsGlobal, function () {
    /************************************
     Variables
     ************************************/

    var numeral,
      _,
      VERSION = '2.0.6',
      formats = {},
      locales = {},
      defaults = {
        currentLocale: 'en',
        zeroFormat: null,
        nullFormat: null,
        defaultFormat: '0,0',
        scalePercentBy100: true
      },
      options = {
        currentLocale: defaults.currentLocale,
        zeroFormat: defaults.zeroFormat,
        nullFormat: defaults.nullFormat,
        defaultFormat: defaults.defaultFormat,
        scalePercentBy100: defaults.scalePercentBy100
      };


    /************************************
     Constructors
     ************************************/

    // Numeral prototype object
    function Numeral(input, number) {
      this._input = input;

      this._value = number;
    }

    numeral = function(input) {
      var value,
        kind,
        unformatFunction,
        regexp;

      if (numeral.isNumeral(input)) {
        value = input.value();
      } else if (input === 0 || typeof input === 'undefined') {
        value = 0;
      } else if (input === null || _.isNaN(input)) {
        value = null;
      } else if (typeof input === 'string') {
        if (options.zeroFormat && input === options.zeroFormat) {
          value = 0;
        } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
          value = null;
        } else {
          for (kind in formats) {
            regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;

            if (regexp && input.match(regexp)) {
              unformatFunction = formats[kind].unformat;

              break;
            }
          }

          unformatFunction = unformatFunction || numeral._.stringToNumber;

          value = unformatFunction(input);
        }
      } else {
        value = Number(input)|| null;
      }

      return new Numeral(input, value);
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function(obj) {
      return obj instanceof Numeral;
    };

    // helper functions
    numeral._ = _ = {
      // formats numbers separators, decimals places, signs, abbreviations
      numberToFormat: function(value, format, roundingFunction) {
        var locale = locales[numeral.options.currentLocale],
          negP = false,
          optDec = false,
          leadingCount = 0,
          abbr = '',
          trillion = 1000000000000,
          billion = 1000000000,
          million = 1000000,
          thousand = 1000,
          decimal = '',
          neg = false,
          abbrForce, // force abbreviation
          abs,
          int,
          precision,
          signed,
          thousands,
          output;

        // make sure we never format a null value
        value = value || 0;

        abs = Math.abs(value);

        // see if we should use parentheses for negative number or if we should prefix with a sign
        // if both are present we default to parentheses
        if (numeral._.includes(format, '(')) {
          negP = true;
          format = format.replace(/[\(|\)]/g, '');
        } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
          signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
          format = format.replace(/[\+|\-]/g, '');
        }

        // see if abbreviation is wanted
        if (numeral._.includes(format, 'a')) {
          abbrForce = format.match(/a(k|m|b|t)?/);

          abbrForce = abbrForce ? abbrForce[1] : false;

          // check for space before abbreviation
          if (numeral._.includes(format, ' a')) {
            abbr = ' ';
          }

          format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

          if (abs >= trillion && !abbrForce || abbrForce === 't') {
            // trillion
            abbr += locale.abbreviations.trillion;
            value = value / trillion;
          } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
            // billion
            abbr += locale.abbreviations.billion;
            value = value / billion;
          } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
            // million
            abbr += locale.abbreviations.million;
            value = value / million;
          } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
            // thousand
            abbr += locale.abbreviations.thousand;
            value = value / thousand;
          }
        }

        // check for optional decimals
        if (numeral._.includes(format, '[.]')) {
          optDec = true;
          format = format.replace('[.]', '.');
        }

        // break number and format
        int = value.toString().split('.')[0];
        precision = format.split('.')[1];
        thousands = format.indexOf(',');
        leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

        if (precision) {
          if (numeral._.includes(precision, '[')) {
            precision = precision.replace(']', '');
            precision = precision.split('[');
            decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
          } else {
            decimal = numeral._.toFixed(value, precision.length, roundingFunction);
          }

          int = decimal.split('.')[0];

          if (numeral._.includes(decimal, '.')) {
            decimal = locale.delimiters.decimal + decimal.split('.')[1];
          } else {
            decimal = '';
          }

          if (optDec && Number(decimal.slice(1)) === 0) {
            decimal = '';
          }
        } else {
          int = numeral._.toFixed(value, 0, roundingFunction);
        }

        // check abbreviation again after rounding
        if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
          int = String(Number(int) / 1000);

          switch (abbr) {
            case locale.abbreviations.thousand:
              abbr = locale.abbreviations.million;
              break;
            case locale.abbreviations.million:
              abbr = locale.abbreviations.billion;
              break;
            case locale.abbreviations.billion:
              abbr = locale.abbreviations.trillion;
              break;
          }
        }


        // format number
        if (numeral._.includes(int, '-')) {
          int = int.slice(1);
          neg = true;
        }

        if (int.length < leadingCount) {
          for (var i = leadingCount - int.length; i > 0; i--) {
            int = '0' + int;
          }
        }

        if (thousands > -1) {
          int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
        }

        if (format.indexOf('.') === 0) {
          int = '';
        }

        output = int + decimal + (abbr ? abbr : '');

        if (negP) {
          output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
        } else {
          if (signed >= 0) {
            output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
          } else if (neg) {
            output = '-' + output;
          }
        }

        return output;
      },
      // unformats numbers separators, decimals places, signs, abbreviations
      stringToNumber: function(string) {
        var locale = locales[options.currentLocale],
          stringOriginal = string,
          abbreviations = {
            thousand: 3,
            million: 6,
            billion: 9,
            trillion: 12
          },
          abbreviation,
          value,
          regexp;

        if (options.zeroFormat && string === options.zeroFormat) {
          value = 0;
        } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
          value = null;
        } else {
          value = 1;

          if (locale.delimiters.decimal !== '.') {
            string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
          }

          for (abbreviation in abbreviations) {
            regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');

            if (stringOriginal.match(regexp)) {
              value *= Math.pow(10, abbreviations[abbreviation]);
              break;
            }
          }

          // check for negative number
          value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;

          // remove non numbers
          string = string.replace(/[^0-9\.]+/g, '');

          value *= Number(string);
        }

        return value;
      },
      isNaN: function(value) {
        return typeof value === 'number' && isNaN(value);
      },
      includes: function(string, search) {
        return string.indexOf(search) !== -1;
      },
      insert: function(string, subString, start) {
        return string.slice(0, start) + subString + string.slice(start);
      },
      reduce: function(array, callback /*, initialValue*/) {
        if (this === null) {
          throw new TypeError('Array.prototype.reduce called on null or undefined');
        }

        if (typeof callback !== 'function') {
          throw new TypeError(callback + ' is not a function');
        }

        var t = Object(array),
          len = t.length >>> 0,
          k = 0,
          value;

        if (arguments.length === 3) {
          value = arguments[2];
        } else {
          while (k < len && !(k in t)) {
            k++;
          }

          if (k >= len) {
            throw new TypeError('Reduce of empty array with no initial value');
          }

          value = t[k++];
        }
        for (; k < len; k++) {
          if (k in t) {
            value = callback(value, t[k], k, t);
          }
        }
        return value;
      },
      /**
       * Computes the multiplier necessary to make x >= 1,
       * effectively eliminating miscalculations caused by
       * finite precision.
       */
      multiplier: function (x) {
        var parts = x.toString().split('.');

        return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
      },
      /**
       * Given a variable number of arguments, returns the maximum
       * multiplier that must be used to normalize an operation involving
       * all of them.
       */
      correctionFactor: function () {
        var args = Array.prototype.slice.call(arguments);

        return args.reduce(function(accum, next) {
          var mn = _.multiplier(next);
          return accum > mn ? accum : mn;
        }, 1);
      },
      /**
       * Implementation of toFixed() that treats floats more like decimals
       *
       * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
       * problems for accounting- and finance-related software.
       */
      toFixed: function(value, maxDecimals, roundingFunction, optionals) {
        var splitValue = value.toString().split('.'),
          minDecimals = maxDecimals - (optionals || 0),
          boundedPrecision,
          optionalsRegExp,
          power,
          output;

        // Use the smallest precision value possible to avoid errors from floating point representation
        if (splitValue.length === 2) {
          boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
        } else {
          boundedPrecision = minDecimals;
        }

        power = Math.pow(10, boundedPrecision);

        // Multiply up by precision, round accurately, then divide and use native toFixed():
        output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

        if (optionals > maxDecimals - boundedPrecision) {
          optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
          output = output.replace(optionalsRegExp, '');
        }

        return output;
      }
    };

    // avaliable options
    numeral.options = options;

    // avaliable formats
    numeral.formats = formats;

    // avaliable formats
    numeral.locales = locales;

    // This function sets the current locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    numeral.locale = function(key) {
      if (key) {
        options.currentLocale = key.toLowerCase();
      }

      return options.currentLocale;
    };

    // This function provides access to the loaded locale data.  If
    // no arguments are passed in, it will simply return the current
    // global locale object.
    numeral.localeData = function(key) {
      if (!key) {
        return locales[options.currentLocale];
      }

      key = key.toLowerCase();

      if (!locales[key]) {
        throw new Error('Unknown locale : ' + key);
      }

      return locales[key];
    };

    numeral.reset = function() {
      for (var property in defaults) {
        options[property] = defaults[property];
      }
    };

    numeral.zeroFormat = function(format) {
      options.zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.nullFormat = function (format) {
      options.nullFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function(format) {
      options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    numeral.register = function(type, name, format) {
      name = name.toLowerCase();

      if (this[type + 's'][name]) {
        throw new TypeError(name + ' ' + type + ' already registered.');
      }

      this[type + 's'][name] = format;

      return format;
    };


    numeral.validate = function(val, culture) {
      var _decimalSep,
        _thousandSep,
        _currSymbol,
        _valArray,
        _abbrObj,
        _thousandRegEx,
        localeData,
        temp;

      //coerce val to string
      if (typeof val !== 'string') {
        val += '';

        if (console.warn) {
          console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
        }
      }

      //trim whitespaces from either sides
      val = val.trim();

      //if val is just digits return true
      if (!!val.match(/^\d+$/)) {
        return true;
      }

      //if val is empty return false
      if (val === '') {
        return false;
      }

      //get the decimal and thousands separator from numeral.localeData
      try {
        //check if the culture is understood by numeral. if not, default it to current locale
        localeData = numeral.localeData(culture);
      } catch (e) {
        localeData = numeral.localeData(numeral.locale());
      }

      //setup the delimiters and currency symbol based on culture/locale
      _currSymbol = localeData.currency.symbol;
      _abbrObj = localeData.abbreviations;
      _decimalSep = localeData.delimiters.decimal;
      if (localeData.delimiters.thousands === '.') {
        _thousandSep = '\\.';
      } else {
        _thousandSep = localeData.delimiters.thousands;
      }

      // validating currency symbol
      temp = val.match(/^[^\d]+/);
      if (temp !== null) {
        val = val.substr(1);
        if (temp[0] !== _currSymbol) {
          return false;
        }
      }

      //validating abbreviation symbol
      temp = val.match(/[^\d]+$/);
      if (temp !== null) {
        val = val.slice(0, -1);
        if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
          return false;
        }
      }

      _thousandRegEx = new RegExp(_thousandSep + '{2}');

      if (!val.match(/[^\d.,]/g)) {
        _valArray = val.split(_decimalSep);
        if (_valArray.length > 2) {
          return false;
        } else {
          if (_valArray.length < 2) {
            return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
          } else {
            if (_valArray[0].length === 1) {
              return ( !! _valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
            } else {
              return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
            }
          }
        }
      }

      return false;
    };


    /************************************
     Numeral Prototype
     ************************************/

    numeral.fn = Numeral.prototype = {
      clone: function() {
        return numeral(this);
      },
      format: function(inputString, roundingFunction) {
        var value = this._value,
          format = inputString || options.defaultFormat,
          kind,
          output,
          formatFunction;

        // make sure we have a roundingFunction
        roundingFunction = roundingFunction || Math.round;

        // format based on value
        if (value === 0 && options.zeroFormat !== null) {
          output = options.zeroFormat;
        } else if (value === null && options.nullFormat !== null) {
          output = options.nullFormat;
        } else {
          for (kind in formats) {
            if (format.match(formats[kind].regexps.format)) {
              formatFunction = formats[kind].format;

              break;
            }
          }

          formatFunction = formatFunction || numeral._.numberToFormat;

          output = formatFunction(value, format, roundingFunction);
        }

        return output;
      },
      value: function() {
        return this._value;
      },
      input: function() {
        return this._input;
      },
      set: function(value) {
        this._value = Number(value);

        return this;
      },
      add: function(value) {
        var corrFactor = _.correctionFactor.call(null, this._value, value);

        function cback(accum, curr, currI, O) {
          return accum + Math.round(corrFactor * curr);
        }

        this._value = _.reduce([this._value, value], cback, 0) / corrFactor;

        return this;
      },
      subtract: function(value) {
        var corrFactor = _.correctionFactor.call(null, this._value, value);

        function cback(accum, curr, currI, O) {
          return accum - Math.round(corrFactor * curr);
        }

        this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;

        return this;
      },
      multiply: function(value) {
        function cback(accum, curr, currI, O) {
          var corrFactor = _.correctionFactor(accum, curr);
          return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
        }

        this._value = _.reduce([this._value, value], cback, 1);

        return this;
      },
      divide: function(value) {
        function cback(accum, curr, currI, O) {
          var corrFactor = _.correctionFactor(accum, curr);
          return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
        }

        this._value = _.reduce([this._value, value], cback);

        return this;
      },
      difference: function(value) {
        return Math.abs(numeral(this._value).subtract(value).value());
      }
    };

    /************************************
     Default Locale && Format
     ************************************/

    numeral.register('locale', 'en', {
      delimiters: {
        thousands: ',',
        decimal: '.'
      },
      abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        var b = number % 10;
        return (~~(number % 100 / 10) === 1) ? 'th' :
          (b === 1) ? 'st' :
            (b === 2) ? 'nd' :
              (b === 3) ? 'rd' : 'th';
      },
      currency: {
        symbol: '$'
      }
    });



    (function() {
      numeral.register('format', 'bps', {
        regexps: {
          format: /(BPS)/,
          unformat: /(BPS)/
        },
        format: function(value, format, roundingFunction) {
          var space = numeral._.includes(format, ' BPS') ? ' ' : '',
            output;

          value = value * 10000;

          // check for space before BPS
          format = format.replace(/\s?BPS/, '');

          output = numeral._.numberToFormat(value, format, roundingFunction);

          if (numeral._.includes(output, ')')) {
            output = output.split('');

            output.splice(-1, 0, space + 'BPS');

            output = output.join('');
          } else {
            output = output + space + 'BPS';
          }

          return output;
        },
        unformat: function(string) {
          return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
        }
      });
    })();


    (function() {
      var decimal = {
          base: 1000,
          suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        },
        binary = {
          base: 1024,
          suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        };

      var allSuffixes =  decimal.suffixes.concat(binary.suffixes.filter(function (item) {
        return decimal.suffixes.indexOf(item) < 0;
      }));
      var unformatRegex = allSuffixes.join('|');
      // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
      unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';

      numeral.register('format', 'bytes', {
        regexps: {
          format: /([0\s]i?b)/,
          unformat: new RegExp(unformatRegex)
        },
        format: function(value, format, roundingFunction) {
          var output,
            bytes = numeral._.includes(format, 'ib') ? binary : decimal,
            suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
            power,
            min,
            max;

          // check for space before
          format = format.replace(/\s?i?b/, '');

          for (power = 0; power <= bytes.suffixes.length; power++) {
            min = Math.pow(bytes.base, power);
            max = Math.pow(bytes.base, power + 1);

            if (value === null || value === 0 || value >= min && value < max) {
              suffix += bytes.suffixes[power];

              if (min > 0) {
                value = value / min;
              }

              break;
            }
          }

          output = numeral._.numberToFormat(value, format, roundingFunction);

          return output + suffix;
        },
        unformat: function(string) {
          var value = numeral._.stringToNumber(string),
            power,
            bytesMultiplier;

          if (value) {
            for (power = decimal.suffixes.length - 1; power >= 0; power--) {
              if (numeral._.includes(string, decimal.suffixes[power])) {
                bytesMultiplier = Math.pow(decimal.base, power);

                break;
              }

              if (numeral._.includes(string, binary.suffixes[power])) {
                bytesMultiplier = Math.pow(binary.base, power);

                break;
              }
            }

            value *= (bytesMultiplier || 1);
          }

          return value;
        }
      });
    })();


    (function() {
      numeral.register('format', 'currency', {
        regexps: {
          format: /(\$)/
        },
        format: function(value, format, roundingFunction) {
          var locale = numeral.locales[numeral.options.currentLocale],
            symbols = {
              before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
              after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
            },
            output,
            symbol,
            i;

          // strip format of spaces and $
          format = format.replace(/\s?\$\s?/, '');

          // format the number
          output = numeral._.numberToFormat(value, format, roundingFunction);

          // update the before and after based on value
          if (value >= 0) {
            symbols.before = symbols.before.replace(/[\-\(]/, '');
            symbols.after = symbols.after.replace(/[\-\)]/, '');
          } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
            symbols.before = '-' + symbols.before;
          }

          // loop through each before symbol
          for (i = 0; i < symbols.before.length; i++) {
            symbol = symbols.before[i];

            switch (symbol) {
              case '$':
                output = numeral._.insert(output, locale.currency.symbol, i);
                break;
              case ' ':
                output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
                break;
            }
          }

          // loop through each after symbol
          for (i = symbols.after.length - 1; i >= 0; i--) {
            symbol = symbols.after[i];

            switch (symbol) {
              case '$':
                output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
                break;
              case ' ':
                output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
                break;
            }
          }


          return output;
        }
      });
    })();


    (function() {
      numeral.register('format', 'exponential', {
        regexps: {
          format: /(e\+|e-)/,
          unformat: /(e\+|e-)/
        },
        format: function(value, format, roundingFunction) {
          var output,
            exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
            parts = exponential.split('e');

          format = format.replace(/e[\+|\-]{1}0/, '');

          output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);

          return output + 'e' + parts[1];
        },
        unformat: function(string) {
          var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
            value = Number(parts[0]),
            power = Number(parts[1]);

          power = numeral._.includes(string, 'e-') ? power *= -1 : power;

          function cback(accum, curr, currI, O) {
            var corrFactor = numeral._.correctionFactor(accum, curr),
              num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
            return num;
          }

          return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
        }
      });
    })();


    (function() {
      numeral.register('format', 'ordinal', {
        regexps: {
          format: /(o)/
        },
        format: function(value, format, roundingFunction) {
          var locale = numeral.locales[numeral.options.currentLocale],
            output,
            ordinal = numeral._.includes(format, ' o') ? ' ' : '';

          // check for space before
          format = format.replace(/\s?o/, '');

          ordinal += locale.ordinal(value);

          output = numeral._.numberToFormat(value, format, roundingFunction);

          return output + ordinal;
        }
      });
    })();


    (function() {
      numeral.register('format', 'percentage', {
        regexps: {
          format: /(%)/,
          unformat: /(%)/
        },
        format: function(value, format, roundingFunction) {
          var space = numeral._.includes(format, ' %') ? ' ' : '',
            output;

          if (numeral.options.scalePercentBy100) {
            value = value * 100;
          }

          // check for space before %
          format = format.replace(/\s?\%/, '');

          output = numeral._.numberToFormat(value, format, roundingFunction);

          if (numeral._.includes(output, ')')) {
            output = output.split('');

            output.splice(-1, 0, space + '%');

            output = output.join('');
          } else {
            output = output + space + '%';
          }

          return output;
        },
        unformat: function(string) {
          var number = numeral._.stringToNumber(string);
          if (numeral.options.scalePercentBy100) {
            return number * 0.01;
          }
          return number;
        }
      });
    })();


    (function() {
      numeral.register('format', 'time', {
        regexps: {
          format: /(:)/,
          unformat: /(:)/
        },
        format: function(value, format, roundingFunction) {
          var hours = Math.floor(value / 60 / 60),
            minutes = Math.floor((value - (hours * 60 * 60)) / 60),
            seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));

          return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        },
        unformat: function(string) {
          var timeArray = string.split(':'),
            seconds = 0;

          // turn hours and minutes into seconds and add them all up
          if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
          } else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
          }
          return Number(seconds);
        }
      });
    })();

    return numeral;
  }));
});

//   gridData.columnDefs.forEach(column => {
//     gridData.rowData.forEach(row => {
//       const formatConf = formatConfig.find(format => format.colId === column.field);
//       if (formatConf) {
//         row[formatConf.colId] = numeral(row[formatConf.colId]).format(formatConf.format);
//       } else {
//         const meaDim = meaDimList.find(item => item.id === column.field);
//         if (meaDim.displayProperties) {
//           row[meaDim.id] = numeral(row[meaDim.id]).format(meaDim.displayProperties.numberFormat);
//         }
//       }
//     });
//   });
//   console.log(gridData);
//   return gridData;
// };

var applyValueFormat = function applyValueFormat(formatConfig, meaDimList, params) {
  var value = params.value;
  var attr = meaDimList.find(function (item) {
    return item.id === params.colDef.field;
  });

  if (attr.displayProperties) {
    value = numeral(value).format(attr.displayProperties.numberFormat);
  }

  if (formatConfig.length) {
    var formatConf = formatConfig.find(function (conf) {
      return conf.colId === params.colDef.field;
    });

    if (formatConf) {
      value = numeral(value).format(formatConf.format);
    }
  }

  return value;
};

var iterateTokenItems = function iterateTokenItems(j, tokenItems, columnIds, params) {
  var xItem = '';
  var arrItems = [];

  for (var i = 0; i < tokenItems.length; i++) {
    if (tokenItems[i].indexOf('[M:' + columnIds[j].field + ']') !== -1) {
      xItem = tokenItems[i].split('[M:' + columnIds[j].field + ']').join(params.node.data[columnIds[j].field]);
      arrItems.push(xItem);
    }

    if (tokenItems[i].indexOf('[D:' + columnIds[j].field + ']') !== -1) {
      xItem = tokenItems[i].split('[D:' + columnIds[j].field + ']').join('\'' + params.node.data[columnIds[j].field] + '\'');
      arrItems.push(xItem);
    }
  }

  return arrItems;
};

var prepareColumnIds = function prepareColumnIds(columnDefs, tokenItems) {
  var columnIds = [];

  var _loop = function _loop(z) {
    var col = tokenItems[z].slice(tokenItems[z].indexOf(':') + 1, tokenItems[z].indexOf(']'));
    var column1 = columnDefs.find(function (column) {
      return column.field === col;
    });
    columnIds.push(column1);
  };

  for (var z = 0; z < tokenItems.length; z++) {
    _loop(z);
  }

  return [].concat(columnIds);
};
/**
 * @name getCellStyles
 * @param {object} newSheet
 * @param params
 * @param measuresDimensions
 * @returns {object}
 * @desc function that returns object with appropriate cellStyle applied to it
 */


function getCellStyles(rangesLists, columnDefs, params, measuresDimensions) {
  var numberStyle;
  var colorObject = null;
  var measures = measuresDimensions.filter(function (mea) {
    return mea.isMeasure === true;
  });
  var dimensions = measuresDimensions.filter(function (dim) {
    return dim.isDimension === true;
  });
  var measure = measures.find(function (item) {
    return item.id === params.colDef.field;
  });
  var dimension = dimensions.find(function (item) {
    return item.id === params.colDef.field;
  });
  numberStyle = measure && measure.isMeasure ? {
    textAlign: 'right'
  } : lodash.isNumber(params.value) ? {
    textAlign: 'right'
  } : {
    textAlign: 'left'
  };

  if (dimension && dimension.isDimension && dimension.type === 'number') {
    numberStyle = {
      textAlign: 'right'
    };
  }

  var rangesList = _objectSpread2({}, rangesLists);

  if (rangesList && rangesList[params.colDef.field]) {
    rangesList[params.colDef.field].forEach(function (item) {
      if (item.rangeCondition) {
        var coId = item.tokenString.slice(item.tokenString.indexOf(':') + 1, item.tokenString.indexOf(']'));
        var column = columnDefs.find(function (col) {
          return col.field === coId;
        });
        var newExp = '';

        if (item.tokenString) {
          if (item.tokenString.indexOf('&&') !== -1) {
            var tokenItems = [];
            tokenItems = item.tokenString.split('&&');
            var columnIds = prepareColumnIds(columnDefs, tokenItems);

            for (var j = 0; j < columnIds.length; j++) {
              if (columnIds[j]) {
                var arrItems = iterateTokenItems(j, tokenItems, columnIds, params);

                for (var l = 0; l < arrItems.length; l++) {
                  var newExpresion = arrItems[l] + '&&' + arrItems[l + 1];

                  try {
                    if (eval(newExpresion)) {
                      colorObject = {
                        color: item.color,
                        backgroundColor: item.backGroundColor
                      };
                    }
                  } catch (ex) {// console.log(ex);
                  }
                }
              }
            }
          } else if (item.tokenString.indexOf('||') !== -1) {
            var _tokenItems = [];
            _tokenItems = item.tokenString.split('||');

            var _columnIds = prepareColumnIds(columnDefs, _tokenItems);

            for (var _j = 0; _j < _columnIds.length; _j++) {
              if (_columnIds[_j]) {
                var _arrItems = iterateTokenItems(_j, _tokenItems, _columnIds, params);

                for (var _l = 0; _l < _arrItems.length; _l++) {
                  var _newExpresion = _arrItems[_l] + '||' + _arrItems[_l + 1];

                  try {
                    if (eval(_newExpresion)) {
                      colorObject = {
                        color: item.color,
                        backgroundColor: item.backGroundColor
                      };
                    }
                  } catch (ex) {// console.log(ex);
                  }
                }
              }
            }
          } else if (column) {
            if (item.tokenString.indexOf('[M:' + column.field + ']') !== -1) {
              newExp = item.tokenString.split('[M:' + column.field + ']').join(params.node.data[column.field]);
            }

            if (item.tokenString.indexOf('[D:' + column.field + ']') !== -1) {
              if (typeof params.node.data[column.field] === 'string') {
                newExp = item.tokenString.split('[D:' + column.field + ']').join('\'' + params.node.data[column.field] + '\'');
              } else {
                newExp = item.tokenString.split('[D:' + column.field + ']').join(params.node.data[column.field]);
              }
            }

            try {
              var exp = newExp;

              if (newExp.indexOf('=') !== -1) {
                exp = newExp.replace('=', '==');
              }

              if (eval(exp)) {
                colorObject = {
                  color: item.color,
                  backgroundColor: item.backGroundColor
                };
              }
            } catch (ex) {// console.log(ex);
            }
          }
        }
      } else if (lodash.toNumber(params.value)) {
        if (params.value >= item.rangeFrom && params.value <= item.rangeTo) {
          colorObject = {
            color: item.color,
            backgroundColor: item.backGroundColor
          };
        }
      }
    });
  }

  return Object.assign(numberStyle, colorObject);
}

var _this = undefined;
var prepareGridData = function prepareGridData(sheetData, data, measures, dimensions) {
  var gridData = convertTableData(data, measures.concat(dimensions));
  gridData.totalRows = data.totalRows;
  var formatConfig = sheetData.pivot.formatConfig ? sheetData.pivot.formatConfig : [];
  var rangesList = sheetData.pivot.metadata && sheetData.pivot.metadata.rangesList ? sheetData.pivot.metadata.rangesList : null;
  gridData.columnDefs.forEach(function (column) {
    column['valueFormatter'] = applyValueFormat.bind(_this, formatConfig, measures.concat(dimensions));

    column['cellStyle'] = function (params) {
      return getCellStyles(rangesList, gridData.columnDefs, params, measures.concat(dimensions));
    };
  });
  return gridData;
};

var onPaginationChanged = function onPaginationChanged(sheetData, accessToken) {
  var request = _objectSpread2({}, sheetData.joinRequest);

  request.page = sheetData.pivot.pageConfig.page;
  request.plimit = sheetData.pivot.pageConfig.plimit;
  request.pstart = sheetData.pivot.pageConfig.pstart;
  return getTableData(request, accessToken);
};

var Sheet = function Sheet(props) {
  var _useState = React.useState(props.sheetData),
    _useState2 = _slicedToArray(_useState, 2),
    sheetData = _useState2[0],
    setSheetData = _useState2[1];

  var onShowSizeChange = function onShowSizeChange(current, pageSize) {
    var SheetOfData = _objectSpread2({}, sheetData);

    SheetOfData.pivot.pageConfig = {
      page: current,
      plimit: pageSize,
      pstart: (current - 1) * pageSize
    };
    onPaginationChanged(SheetOfData, props.accessToken).then(function (data) {
      var measures = props.measures,
        dimensions = props.dimensions;
      SheetOfData['gridData'] = prepareGridData(SheetOfData, data, measures, dimensions);
      setSheetData(_objectSpread2({}, SheetOfData));
    });
  };

  var onPageChange = function onPageChange(page, pageSize) {
    var SheetOfData = _objectSpread2({}, sheetData);

    SheetOfData.pivot.pageConfig = {
      page: page,
      plimit: pageSize,
      pstart: (page - 1) * pageSize
    };
    onPaginationChanged(SheetOfData, props.accessToken).then(function (data) {
      var measures = props.measures,
        dimensions = props.dimensions;
      SheetOfData['gridData'] = prepareGridData(SheetOfData, data, measures, dimensions);
      setSheetData(_objectSpread2({}, SheetOfData));
    });
  };

  React.useEffect(function () {
    var sheetData = props.sheetData,
      measures = props.measures,
      dimensions = props.dimensions,
      accessToken = props.accessToken;

    switch (sheetData.viewType) {
      case 'table':
        getTableData(sheetData.joinRequest, accessToken).then(function (data) {
          var SheetOfData = _objectSpread2({}, sheetData);

          SheetOfData['gridData'] = prepareGridData(SheetOfData, data, measures, dimensions);
          setSheetData(_objectSpread2({}, SheetOfData));
        });
        break;

      case 'chart':
        getTableData(sheetData.joinRequest, accessToken).then(function (data) {
          var gridData = convertTableData(data.data, measures.concat(dimensions));
          sheetData['gridData'] = gridData;
          setSheetData(_objectSpread2({}, sheetData));
        });
        break;
    }
  }, [props.sheetData.id]);
  return React__default.createElement("div", {
    className: "sheet-container"
  }, sheetData.viewType === 'table' ? React__default.createElement(SheetContext.Provider, {
    value: sheetData
  }, React__default.createElement(Table, {
    gridData: sheetData.gridData,
    pageConfig: sheetData.pivot.pageConfig,
    onShowSizeChange: onShowSizeChange,
    onPageChange: onPageChange
  })) : React__default.createElement(Chart, {
    gridData: sheetData.gridData
  }));
};
Sheet.propTypes = {
  measures: PropTypes.array.isRequired,
  dimensions: PropTypes.array.isRequired,
  sheetData: PropTypes.object.isRequired,
  accessToken: PropTypes.string.isRequired,
  isEditable: PropTypes.bool
};

exports.Chart = Chart;
exports.Sheet = Sheet;
exports.Table = Table;
//# sourceMappingURL=index.js.map
