webpackJsonp([1],{

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(109)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 108:
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 109:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 110:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(111)
  __webpack_require__(113)
}
var normalizeComponent = __webpack_require__(108)
/* script */
var __vue_script__ = __webpack_require__(115)
/* template */
var __vue_template__ = __webpack_require__(116)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-321dc3cd"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/Modules/Table/BaseTable.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-321dc3cd", Component.options)
  } else {
    hotAPI.reload("data-v-321dc3cd", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 111:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(112);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(107)("dcd460a6", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-321dc3cd\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/_less-loader@4.1.0@less-loader/dist/cjs.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=0!./BaseTable.vue", function() {
     var newContent = require("!!../../../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-321dc3cd\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/_less-loader@4.1.0@less-loader/dist/cjs.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=0!./BaseTable.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.header[data-v-321dc3cd] {\n  width: 100%;\n  height: 0.5rem;\n}\n.header .left[data-v-321dc3cd] {\n  width: 50%;\n  height: 100%;\n}\n.header .right[data-v-321dc3cd] {\n  width: 50%;\n  height: 100%;\n}\n.header .right form[data-v-321dc3cd] {\n  width: 3rem;\n}\n.header .right form .search-input[data-v-321dc3cd] {\n  font-size: 0.2rem;\n  width: 3rem;\n  height: 100%;\n  padding: 0 0 0 0.4rem;\n}\n.table-component[data-v-321dc3cd] {\n  width: 100%;\n  margin-bottom: 0.2rem;\n}\n.table-component table[data-v-321dc3cd] {\n  width: 100%;\n  min-width: 0;\n}\n.table-component table tr th[data-v-321dc3cd] {\n  font-size: 0.16rem;\n  font-weight: 700;\n}\n.table-component table tr td[data-v-321dc3cd] {\n  font-size: 0.14rem;\n  line-height: 0.4rem;\n}\n.table-component table tr td button[data-v-321dc3cd] {\n  font-size: 0.14rem;\n}\n.table-component table tr td .td-input[data-v-321dc3cd] {\n  text-align: center;\n  width: auto;\n  height: 0.37rem;\n}\n.page[data-v-321dc3cd] {\n  width: 100%;\n  height: 0.5rem;\n  font-size: 0.16rem;\n}\n", ""]);

// exports


/***/ }),

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(114);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(107)("00ab0a74", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-321dc3cd\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=1!./BaseTable.vue", function() {
     var newContent = require("!!../../../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-321dc3cd\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=1!./BaseTable.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),

/***/ 115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      colData: [],
      sourceData: [],
      newRow: {},
      defaulExcept: ['created_at', 'updated_at', 'deleted_at'],
      isEdit: false,
      isCreate: false,
      curEdit: -1,
      searchVal: '',
      curPage: 1
    };
  },

  props: {
    canEdit: Array,
    fieldTypes: Array,
    except: Array,
    ApiName: String
  },
  methods: {
    getCol: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
        var _this = this;

        var _ref2, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return axios.get(this.$store.state.API[this.ApiName].R + '/show');

              case 2:
                _ref2 = _context.sent;
                data = _ref2.data;

                this.colData = data;
                this.colData.forEach(function (item, index) {
                  if (_this.fieldTypes[index] === 3) {
                    _this.newRow[item.key] = true;
                  } else {
                    _this.newRow[item.key] = '';
                  }
                });

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getCol() {
        return _ref.apply(this, arguments);
      }

      return getCol;
    }(),
    getSource: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee2() {
        var _ref4, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return axios.get(this.$store.state.API[this.ApiName].R, {
                  params: {
                    page: this.curPage
                  }
                });

              case 2:
                _ref4 = _context2.sent;
                data = _ref4.data;

                console.log(data);
                this.sourceData = data.data;
                this.$store.dispatch('setTotal', data.data.total);

              case 7:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getSource() {
        return _ref3.apply(this, arguments);
      }

      return getSource;
    }(),
    setVuexExcept: function setVuexExcept(item) {
      this.$store.dispatch('setExcept', item);
    },
    edit: function edit(rowNum) {
      if (this.isCreate) {
        this.cancelCreate();
      }
      this.curEdit = rowNum;
    },
    save: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee3(rowNum) {
        var i, _ref6, status, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                for (i in this.sourceData.data[rowNum]) {
                  if (this.sourceData.data[rowNum][i] === 1) {
                    this.sourceData.data[rowNum][i] === true;
                  } else if (this.sourceData.data[rowNum][i] === 0) {
                    this.sourceData.data[rowNum][i] === false;
                  }
                }
                _context3.next = 3;
                return axios.post(this.$store.state.API[this.ApiName].U, {
                  id: this.sourceData.data[rowNum].id,
                  data: this.sourceData.data[rowNum]
                });

              case 3:
                _ref6 = _context3.sent;
                status = _ref6.status;
                data = _ref6.data;

                this.pushTips(status, data);
                this.curEdit = -1;

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function save(_x) {
        return _ref5.apply(this, arguments);
      }

      return save;
    }(),
    deleteRow: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee4(rowNum) {
        var _ref8, status, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return axios.post(this.$store.state.API[this.ApiName].D, {
                  id: this.sourceData.data[rowNum].id
                });

              case 2:
                _ref8 = _context4.sent;
                status = _ref8.status;
                data = _ref8.data;

                this.pushTips(status, data);
                this.drawTable();

              case 7:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function deleteRow(_x2) {
        return _ref7.apply(this, arguments);
      }

      return deleteRow;
    }(),
    create: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee5() {
        var _ref10, status, data, key;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.isCreate = false;
                this.curEdit = -1;
                this.$store.dispatch('setCreateStatus');
                _context5.next = 5;
                return axios.post(this.$store.state.API[this.ApiName].C, { data: this.newRow });

              case 5:
                _ref10 = _context5.sent;
                status = _ref10.status;
                data = _ref10.data;

                for (key in this.newRow) {
                  this.newRow[key] = '';
                }
                this.pushTips(status, data);
                this.drawTable();

              case 11:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function create() {
        return _ref9.apply(this, arguments);
      }

      return create;
    }(),
    switchChange: function switchChange(item, rowIndex, key) {
      if (item === 1) {
        this.sourceData.data[rowIndex][key] = 0;
      } else {
        this.sourceData.data[rowIndex][key] = 1;
      }
    },
    pushTips: function pushTips(status, data) {
      if (status === 200 && data.status === 200) {
        this.$Notice.success({
          title: '很遺憾,成功了!',
          desc: data.msg
        });
      } else if (status === 201) {
        this.$Notice.success({
          title: '很遺憾,成功了!',
          desc: '創建數據成功!'
        });
      } else {
        this.$Notice.error({
          title: '恭喜你,失敗了!',
          desc: data.msg
        });
      }
    },
    drawTable: function drawTable() {
      var _this2 = this;

      setTimeout(function () {
        _this2.getSource();
      }, 500);
    },
    cancelEdit: function cancelEdit() {
      this.curEdit = -1;
    },
    cancelCreate: function cancelCreate() {
      this.sourceData.data.shift();
      this.curEdit = -1;
      this.isCreate = false;
      this.$store.dispatch('setCreateStatus');
    }
  },
  beforeCreate: function beforeCreate() {
    this.$nextTick(function () {
      this.getCol();
      this.getSource();
    });
  },
  destroyed: function destroyed() {
    this.$store.dispatch('initTotal');
  },
  mounted: function mounted() {
    if (this.except) {
      var arr = [];
      arr = [].concat(_toConsumableArray(this.except), _toConsumableArray(this.defaulExcept));
      this.setVuexExcept(arr);
    } else {
      this.setVuexExcept(this.defaulExcept);
    }
  },

  computed: {
    getCurPage: function getCurPage() {
      return this.$store.state.Page.curPage;
    },
    getCreateStatus: function getCreateStatus() {
      return this.$store.state.Table.createStatus;
    }
  },
  watch: {
    getCurPage: function getCurPage(val) {
      this.curPage = val;
      this.getSource();
    },
    getCreateStatus: function getCreateStatus(val) {
      if (val) {
        this.sourceData.data.unshift(this.newRow);
        this.curEdit = 0;
        this.isCreate = true;
      }
    }
  }
});

/***/ }),

/***/ 116:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "section",
    { staticClass: "table-component uk-overflow-auto" },
    [
      !_vm.$store.state.Page.isComplete
        ? _c("Spin", { attrs: { size: "large", fix: "" } })
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "header uk-flex uk-flex-between" }, [
        _c("div", { staticClass: "left" }),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "right uk-flex uk-flex-right" },
          [
            _c(
              "Col",
              { staticStyle: { "margin-top": ".1rem" }, attrs: { span: "12" } },
              [
                _c("Input", {
                  attrs: { placeholder: "Search something...", clearable: "" },
                  model: {
                    value: _vm.searchVal,
                    callback: function($$v) {
                      _vm.searchVal = $$v
                    },
                    expression: "searchVal"
                  }
                })
              ],
              1
            )
          ],
          1
        )
      ]),
      _vm._v(" "),
      _c("table", { staticClass: "uk-table uk-table-divider uk-text-center" }, [
        _c("thead", [
          _c(
            "tr",
            { staticClass: "table-title" },
            [
              _vm._l(_vm.colData, function(item, index) {
                return _c(
                  "th",
                  {
                    key: index,
                    staticClass: "uk-text-center",
                    attrs: { "data-key": item.key }
                  },
                  [_vm._v(_vm._s(item.title))]
                )
              }),
              _vm._v(" "),
              _c(
                "th",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.$store.state.Page.isComplete,
                      expression: "$store.state.Page.isComplete"
                    }
                  ],
                  staticClass: "uk-text-center",
                  staticStyle: { width: "4rem" }
                },
                [_vm._v("操作")]
              )
            ],
            2
          )
        ]),
        _vm._v(" "),
        _c(
          "tbody",
          _vm._l(_vm.sourceData.data, function(rowItem, rowIndex) {
            return _c(
              "tr",
              { key: rowIndex },
              [
                _vm._l(rowItem, function(item, key, index) {
                  return _vm.$store.state.Table.fieldExcept.indexOf(key) === -1
                    ? _c("td", { key: index }, [
                        !(_vm.curEdit === rowIndex) || !_vm.canEdit[index]
                          ? _c("span", [
                              _vm.fieldTypes[index] === 1
                                ? _c("span", [_vm._v(_vm._s(item))])
                                : _vm.fieldTypes[index] === 2
                                  ? _c("span", [_vm._v(_vm._s(item))])
                                  : _vm.fieldTypes[index] === 3
                                    ? _c(
                                        "span",
                                        [
                                          _c(
                                            "i-switch",
                                            {
                                              attrs: { disabled: true },
                                              model: {
                                                value:
                                                  _vm.sourceData.data[rowIndex][
                                                    key
                                                  ] === 1,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    _vm.sourceData,
                                                    "data[rowIndex][key] === 1",
                                                    $$v
                                                  )
                                                },
                                                expression:
                                                  "sourceData.data[rowIndex][key] === 1"
                                              }
                                            },
                                            [
                                              _c("Icon", {
                                                attrs: {
                                                  slot: "open",
                                                  type: "android-done"
                                                },
                                                slot: "open"
                                              }),
                                              _vm._v(" "),
                                              _c("Icon", {
                                                attrs: {
                                                  slot: "close",
                                                  type: "android-close"
                                                },
                                                slot: "close"
                                              })
                                            ],
                                            1
                                          )
                                        ],
                                        1
                                      )
                                    : _vm._e()
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.curEdit === rowIndex
                          ? _c("span", [
                              _vm.fieldTypes[index] === 1 && _vm.canEdit[index]
                                ? _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value:
                                          _vm.sourceData.data[rowIndex][key],
                                        expression:
                                          "sourceData.data[rowIndex][key]"
                                      }
                                    ],
                                    staticClass: "td-input",
                                    attrs: { type: "text" },
                                    domProps: {
                                      value: _vm.sourceData.data[rowIndex][key]
                                    },
                                    on: {
                                      input: function($event) {
                                        if ($event.target.composing) {
                                          return
                                        }
                                        _vm.$set(
                                          _vm.sourceData.data[rowIndex],
                                          key,
                                          $event.target.value
                                        )
                                      }
                                    }
                                  })
                                : _vm.fieldTypes[index] === 2 &&
                                  _vm.canEdit[index]
                                  ? _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value:
                                            _vm.sourceData.data[rowIndex][key],
                                          expression:
                                            "sourceData.data[rowIndex][key]"
                                        }
                                      ],
                                      attrs: { type: "text" },
                                      domProps: {
                                        value:
                                          _vm.sourceData.data[rowIndex][key]
                                      },
                                      on: {
                                        input: function($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.sourceData.data[rowIndex],
                                            key,
                                            $event.target.value
                                          )
                                        }
                                      }
                                    })
                                  : _vm.fieldTypes[index] === 3 &&
                                    _vm.canEdit[index]
                                    ? _c(
                                        "span",
                                        [
                                          _c(
                                            "i-switch",
                                            {
                                              on: {
                                                "on-change": function($event) {
                                                  _vm.switchChange(
                                                    _vm.sourceData.data[
                                                      rowIndex
                                                    ][key],
                                                    rowIndex,
                                                    key
                                                  )
                                                }
                                              },
                                              model: {
                                                value:
                                                  _vm.sourceData.data[rowIndex][
                                                    key
                                                  ] === 1,
                                                callback: function($$v) {
                                                  _vm.$set(
                                                    _vm.sourceData,
                                                    "data[rowIndex][key] === 1",
                                                    $$v
                                                  )
                                                },
                                                expression:
                                                  "sourceData.data[rowIndex][key] === 1"
                                              }
                                            },
                                            [
                                              _c("Icon", {
                                                attrs: {
                                                  slot: "open",
                                                  type: "android-done"
                                                },
                                                slot: "open"
                                              }),
                                              _vm._v(" "),
                                              _c("Icon", {
                                                attrs: {
                                                  slot: "close",
                                                  type: "android-close"
                                                },
                                                slot: "close"
                                              })
                                            ],
                                            1
                                          )
                                        ],
                                        1
                                      )
                                    : _vm._e()
                            ])
                          : _vm._e()
                      ])
                    : _vm._e()
                }),
                _vm._v(" "),
                _c("td", { staticClass: "action-btn uk-flex uk-flex-center" }, [
                  _vm.curEdit === rowIndex && _vm.isCreate
                    ? _c(
                        "button",
                        {
                          staticClass:
                            "uk-button uk-button-default uk-button-small",
                          staticStyle: { "margin-right": ".2rem" },
                          on: { click: _vm.create }
                        },
                        [_vm._v("創建")]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.curEdit !== rowIndex
                    ? _c(
                        "button",
                        {
                          staticClass:
                            "uk-button uk-button-secondary uk-button-small",
                          staticStyle: { "margin-right": ".2rem" },
                          on: {
                            click: function($event) {
                              _vm.edit(rowIndex)
                            }
                          }
                        },
                        [_vm._v("編輯")]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.curEdit === rowIndex && !_vm.isCreate
                    ? _c(
                        "button",
                        {
                          staticClass:
                            "uk-button uk-button-primary uk-button-small",
                          staticStyle: { "margin-right": ".2rem" },
                          on: {
                            click: function($event) {
                              _vm.save(rowIndex)
                            }
                          }
                        },
                        [_vm._v("保存")]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.curEdit !== rowIndex
                    ? _c(
                        "button",
                        {
                          staticClass:
                            "uk-button uk-button-danger uk-button-small",
                          on: {
                            click: function($event) {
                              _vm.deleteRow(rowIndex)
                            }
                          }
                        },
                        [_vm._v("刪除")]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.curEdit === rowIndex && !_vm.isCreate
                    ? _c(
                        "button",
                        {
                          staticClass:
                            "uk-button uk-button-default uk-button-small",
                          on: { click: _vm.cancelEdit }
                        },
                        [_vm._v("取消")]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.curEdit === rowIndex && _vm.isCreate
                    ? _c(
                        "button",
                        {
                          staticClass:
                            "uk-button uk-button-secondary uk-button-small",
                          on: { click: _vm.cancelCreate }
                        },
                        [_vm._v("撤銷")]
                      )
                    : _vm._e()
                ])
              ],
              2
            )
          })
        )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-321dc3cd", module.exports)
  }
}

/***/ }),

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(118);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(107)("3326b22a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-439d8d46\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/_less-loader@4.1.0@less-loader/dist/cjs.js!../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=0!./Manager.vue", function() {
     var newContent = require("!!../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-439d8d46\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/_less-loader@4.1.0@less-loader/dist/cjs.js!../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=0!./Manager.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(9);
exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\nbody .index-section[data-v-439d8d46] {\n  height: auto;\n  min-height: 100vh;\n  width: 100%;\n}\nbody .index-section .index-container[data-v-439d8d46] {\n  width: 100%;\n  height: 100%;\n  min-height: 100vh;\n  margin: 0;\n  padding: 0;\n}\nbody .index-section .index-container .container-box[data-v-439d8d46] {\n  width: 100%;\n}\nbody .index-section .index-container .container-box .whale[data-v-439d8d46] {\n  background: url(" + escape(__webpack_require__(119)) + ") no-repeat;\n  width: 0.8rem;\n  height: 0.8rem;\n  background-size: cover;\n  position: absolute;\n  top: 0;\n  left: 50%;\n  margin-left: -0.5rem;\n  z-index: 2;\n}\nbody .index-section .index-container .container-box .slide-button[data-v-439d8d46] {\n  font-size: 0.16rem;\n}\nbody .index-section .index-container .container-box .header[data-v-439d8d46] {\n  width: 100%;\n  height: 10vh;\n  margin-top: 0.2rem;\n}\nbody .index-section .index-container .container-box .header .header-up[data-v-439d8d46] {\n  width: 100%;\n  height: 40%;\n}\nbody .index-section .index-container .container-box .header .header-up .bread[data-v-439d8d46] {\n  width: 10rem;\n  height: 1rem;\n  position: relative;\n  left: 0.5rem;\n}\nbody .index-section .index-container .container-box .header .header-up .bread a li[data-v-439d8d46] {\n  font-size: 0.2rem;\n}\nbody .index-section .index-container .container-box .header .header-up .bread a .bread-active[data-v-439d8d46] {\n  font-size: 0.2rem;\n}\nbody .index-section .index-container .container-box .header .header-up .btns[data-v-439d8d46] {\n  margin-right: 1rem;\n  width: 10vw;\n}\nbody .index-section .index-container .container-box .header .header-up .uk-button-text[data-v-439d8d46] {\n  border: none;\n  outline: none;\n  font-size: 0.2rem;\n}\nbody .index-section .index-container .container-box .header .header-down[data-v-439d8d46] {\n  width: 90%;\n  margin: 0 auto;\n}\nbody .index-section .index-container .container-box .header .header-down .tag-list li[data-v-439d8d46] {\n  margin-right: 0.1rem;\n}\nbody .index-section .index-container .container-box .header .header-down .tag-list li a[data-v-439d8d46] {\n  font-size: 0.18rem;\n}\nbody .index-section .index-container .container-box .content-box[data-v-439d8d46] {\n  width: 90%;\n  height: 80vh;\n  margin: 2.5vh auto;\n}\nbody .index-section .index-container .container-box .content-box .close-btn[data-v-439d8d46] {\n  background: url(" + escape(__webpack_require__(120)) + ") no-repeat;\n  width: 0.35rem;\n  height: 0.35rem;\n  background-size: cover;\n  position: relative;\n  top: -10px;\n  left: 10px;\n  z-index: 99;\n}\nbody .index-section .index-container .container-box .content-box .add-btn[data-v-439d8d46] {\n  background: url(" + escape(__webpack_require__(121)) + ") no-repeat;\n  width: 0.35rem;\n  height: 0.35rem;\n  background-size: cover;\n  position: absolute;\n  top: 13vh;\n  right: 4vw;\n  z-index: 99;\n}\nbody .index-section .index-container .container-box .content-box .card-box[data-v-439d8d46] {\n  width: 100%;\n  border-radius: 0.25rem;\n  overflow-y: auto;\n}\nbody .index-section .index-container .container-box .content-box .card-box .item-title[data-v-439d8d46] {\n  font-size: 0.2rem;\n}\nbody .index-section .index-container .container-box .content-box .card-box .article-info[data-v-439d8d46] {\n  font-size: 0.16rem;\n}\nbody .page[data-v-439d8d46] {\n  position: absolute;\n  bottom: 3.5vh;\n  left: 50%;\n  height: 1vh;\n  font-size: 0.16rem;\n  transform: translate(-50%, 0);\n}\nbody .button-group button[data-v-439d8d46] {\n  font-size: 0.16rem;\n  width: 1rem;\n  height: 0.3rem;\n  position: relative;\n  top: -0.4rem;\n  margin: 0;\n  padding: 0;\n}\n.uk-offcanvas-bar[data-v-439d8d46] {\n  background-color: #fff;\n}\n.uk-offcanvas-bar .uk-parent a[data-v-439d8d46] {\n  font-size: 0.4rem;\n}\n.uk-offcanvas-bar .uk-parent .uk-nav-sub[data-v-439d8d46] {\n  font-size: 0.2rem;\n}\n.uk-offcanvas-bar .uk-close[data-v-439d8d46] {\n  color: red;\n}\n[data-v-439d8d46]::-webkit-scrollbar {\n  width: 0;\n}\n", ""]);

// exports


/***/ }),

/***/ 119:
/***/ (function(module, exports) {

module.exports = "/images/whale.png?1d6799562162d1d555915ceeb67fe599";

/***/ }),

/***/ 120:
/***/ (function(module, exports) {

module.exports = "/images/close.png?11e7ec904e83a319dc7ade8c607400d8";

/***/ }),

/***/ 121:
/***/ (function(module, exports) {

module.exports = "/images/add.png?4d6e07bfecd6e716c0cfd7923ad97159";

/***/ }),

/***/ 122:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(123);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(107)("509336c8", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-439d8d46\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=1!./Manager.vue", function() {
     var newContent = require("!!../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-439d8d46\",\"scoped\":false,\"hasInlineConfig\":true}!../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=1!./Manager.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 123:
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(9);
exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n@font-face\n{\n    font-family: myCode;\n    src: url(" + escape(__webpack_require__(124)) + ");\n}\nbody {\n    font-family: myCode !important;\n}\n", ""]);

// exports


/***/ }),

/***/ 124:
/***/ (function(module, exports) {

module.exports = "/fonts/myCode.otf?1eaef0872c3f59b736deb6d442bed4fd";

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Modules_Table_BaseTable__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Modules_Table_BaseTable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__components_Modules_Table_BaseTable__);


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {};
  },

  components: {
    baseTable: __WEBPACK_IMPORTED_MODULE_1__components_Modules_Table_BaseTable___default.a
  },
  computed: {
    navData: function navData() {
      return this.$store.state.Nav.navData;
    },
    tagData: function tagData() {
      return this.$store.state.Nav.tagData;
    }
  },
  methods: {
    addTag: function addTag(item) {
      this.$store.dispatch('addTag', item);
    },
    removeTag: function removeTag(item) {
      var _this = this;

      this.$store.dispatch('removeTag', item);
      if (item.length > 0) {
        item.forEach(function (cItem, index) {
          if (cItem.isActive === true) {
            if (item[index].routerName !== '') {
              _this.$router.push({ name: item[index].routerName });
            }
          }
        });
      } else {
        this.$router.push({ path: '/' });
      }
    },
    changeTag: function changeTag(item) {
      this.$store.dispatch('changeTag', item);
    },
    changePage: function changePage(item) {
      $(".card-box").animate({ scrollTop: 0 }, 100);
      $('.card-box').css({
        "overflow-y": "hidden"
      });
      this.$store.dispatch('changePage', item);
    },
    addRow: function addRow() {
      this.$store.dispatch('setCreateStatus');
    },
    logout: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
        var _this2 = this;

        var _ref2, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return axios.post('/logout');

              case 2:
                _ref2 = _context.sent;
                data = _ref2.data;

                if (data.status === 204) {
                  this.$store.dispatch('logoutRequest');
                  this.$Notice.success({
                    title: data.msg,
                    desc: '頁面即將跳轉...'
                  });
                  setTimeout(function () {
                    _this2.$router.push({ path: '/' });
                  }, 1500);
                }

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function logout() {
        return _ref.apply(this, arguments);
      }

      return logout;
    }(),
    postArticle: function postArticle() {
      this.$store.dispatch('setEditComplete');
    },
    cancelArticle: function cancelArticle() {
      this.$store.dispatch('cancelEditData');
    },
    addArticle: function addArticle() {
      this.$store.dispatch('setIsShow');
    },
    saveArticle: function saveArticle() {
      alert('功能正在開發中!');
    }
  }
});

/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("section", { staticClass: "uk-section-muted index-section" }, [
    _c(
      "section",
      {
        staticClass: "uk-container uk-container-expand uk-flex index-container"
      },
      [
        _c(
          "div",
          {
            attrs: {
              id: "offcanvas-slide",
              "uk-offcanvas": "mode: push; overlay: true"
            }
          },
          [
            _c("div", { staticClass: "uk-offcanvas-bar" }, [
              _c("button", {
                staticClass: "uk-offcanvas-close",
                attrs: { type: "button", "uk-close": "" }
              }),
              _vm._v(" "),
              _c(
                "ul",
                {
                  staticClass: "uk-nav-default uk-nav-parent-icon",
                  attrs: { "uk-nav": "" }
                },
                _vm._l(_vm.navData, function(item, index) {
                  return _c(
                    "li",
                    { key: index, staticClass: "uk-parent" },
                    [
                      _c(
                        "router-link",
                        {
                          staticStyle: {
                            color: "#abcdef",
                            "font-size": ".4rem"
                          },
                          attrs: { to: "#" }
                        },
                        [_vm._v(_vm._s(item.itemName))]
                      ),
                      _vm._v(" "),
                      item.hasChildren
                        ? _c(
                            "ul",
                            { staticClass: "uk-nav-sub" },
                            _vm._l(item.childrenItem, function(cItem, cIndex) {
                              return _c(
                                "li",
                                {
                                  key: cIndex,
                                  on: {
                                    click: function($event) {
                                      _vm.addTag(cItem)
                                    }
                                  }
                                },
                                [
                                  _c(
                                    "router-link",
                                    {
                                      staticStyle: {
                                        color: "hotpink",
                                        "font-size": ".3rem"
                                      },
                                      attrs: { to: { name: cItem.routerName } }
                                    },
                                    [_vm._v(_vm._s(cItem.itemName))]
                                  )
                                ],
                                1
                              )
                            })
                          )
                        : _vm._e()
                    ],
                    1
                  )
                })
              )
            ])
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "container-box" }, [
          _c("div", {
            staticClass: "whale",
            attrs: { "uk-toggle": "target: #offcanvas-slide" }
          }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "header uk-flex uk-flex-between uk-flex-column" },
            [
              _c("div", { staticClass: "header-up uk-flex uk-flex-between" }, [
                _c(
                  "ul",
                  { staticClass: "uk-breadcrumb bread" },
                  [
                    _c("router-link", { attrs: { to: { path: "/" } } }, [
                      _c("li", [_vm._v("主頁")])
                    ]),
                    _vm._v(" "),
                    _c(
                      "router-link",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: _vm.$store.state.Nav.curFather,
                            expression: "$store.state.Nav.curFather"
                          }
                        ],
                        staticClass: "uk-disabled",
                        attrs: { to: "#" }
                      },
                      [
                        _c("li", [
                          _vm._v(_vm._s(_vm.$store.state.Nav.curFather))
                        ])
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "router-link",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: _vm.$store.state.Nav.curChild,
                            expression: "$store.state.Nav.curChild"
                          }
                        ],
                        attrs: { to: { name: _vm.$store.state.Nav.curRouter } }
                      },
                      [
                        _c("li", [
                          _c("span", { staticClass: "bread-active" }, [
                            _vm._v(_vm._s(_vm.$store.state.Nav.curChild))
                          ])
                        ])
                      ]
                    )
                  ],
                  1
                ),
                _vm._v(" "),
                !this.$store.state.Login.Authenticate
                  ? _c(
                      "div",
                      { staticClass: "btns uk-flex uk-flex-around" },
                      [
                        _c(
                          "router-link",
                          { attrs: { to: { name: "Login" } } },
                          [
                            _c(
                              "button",
                              { staticClass: "uk-button-text login" },
                              [_vm._v("登錄")]
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "router-link",
                          { attrs: { to: { name: "Register" } } },
                          [
                            _c(
                              "button",
                              { staticClass: "uk-button-text register" },
                              [_vm._v("註冊")]
                            )
                          ]
                        )
                      ],
                      1
                    )
                  : _vm._e(),
                _vm._v(" "),
                this.$store.state.Login.Authenticate
                  ? _c(
                      "div",
                      { staticClass: "btns uk-flex uk-flex-around" },
                      [
                        _c(
                          "router-link",
                          { attrs: { to: { name: "AdminInfo" } } },
                          [
                            _c(
                              "button",
                              { staticClass: "uk-button-text login" },
                              [_vm._v("個人中心")]
                            )
                          ]
                        ),
                        _vm._v(" "),
                        _c("router-link", { attrs: { to: "" } }, [
                          _c(
                            "button",
                            {
                              staticClass: "uk-button-text register",
                              on: { click: _vm.logout }
                            },
                            [_vm._v("退出登錄")]
                          )
                        ])
                      ],
                      1
                    )
                  : _vm._e()
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "header-down" }, [
                _c(
                  "ul",
                  { staticClass: "tag-list", attrs: { "uk-tab": "" } },
                  _vm._l(_vm.tagData, function(item, index) {
                    return _c(
                      "li",
                      {
                        key: index,
                        class: item.isActive ? "uk-active" : "",
                        on: {
                          click: function($event) {
                            _vm.changeTag(item)
                          }
                        }
                      },
                      [
                        _c(
                          "router-link",
                          { attrs: { to: { name: item.routerName } } },
                          [_vm._v(_vm._s(item.itemName))]
                        )
                      ],
                      1
                    )
                  })
                )
              ])
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "content-box uk-flex uk-flex-center" }, [
            _c("div", {
              staticClass: "close-btn",
              on: {
                click: function($event) {
                  _vm.removeTag(_vm.$store.state.Nav.tagData)
                }
              }
            }),
            _vm._v(" "),
            _vm.$store.state.Page.total > -1
              ? _c("div", { staticClass: "add-btn", on: { click: _vm.addRow } })
              : _vm._e(),
            _vm._v(" "),
            _vm.$store.state.Page.total === -1
              ? _c("div", {
                  staticClass: "add-btn",
                  on: { click: _vm.addArticle }
                })
              : _vm._e(),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass:
                  "uk-card uk-card-default uk-card-hover uk-card-body card-box"
              },
              [
                _vm.$store.state.Nav.curChild &&
                _vm.$store.state.Nav.curChild != "編輯文章"
                  ? _c(
                      "p",
                      {
                        staticClass: "uk-card-title uk-text-center item-title"
                      },
                      [_vm._v(_vm._s(_vm.$store.state.Nav.curChild))]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _vm.$store.state.Nav.curChild === "編輯文章"
                  ? _c(
                      "div",
                      { staticClass: "article-info uk-flex uk-flex-around" },
                      [
                        _c("div", [
                          _c(
                            "span",
                            {
                              staticClass:
                                "uk-flex uk-flex-center uk-flex-middle"
                            },
                            [
                              _vm._v(
                                "標題: " +
                                  _vm._s(
                                    _vm.$store.state.Article.articleInfo.title
                                  )
                              )
                            ]
                          )
                        ]),
                        _vm._v(" "),
                        _c("div", [
                          _c(
                            "span",
                            {
                              staticClass:
                                "uk-flex uk-flex-center uk-flex-middle"
                            },
                            [
                              _vm._v(
                                "所屬遊戲: " +
                                  _vm._s(_vm.$store.state.Article.game_name)
                              )
                            ]
                          )
                        ]),
                        _vm._v(" "),
                        _c("div", [
                          _c(
                            "span",
                            {
                              staticClass:
                                "uk-flex uk-flex-center uk-flex-middle"
                            },
                            [
                              _vm._v(
                                "所屬分類: " +
                                  _vm._s(_vm.$store.state.Article.cate_name)
                              )
                            ]
                          )
                        ])
                      ]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c("router-view")
              ],
              1
            )
          ])
        ])
      ]
    ),
    _vm._v(" "),
    _vm.$store.state.Page.total > -1
      ? _c(
          "div",
          { staticClass: "page" },
          [
            _c("Page", {
              attrs: {
                total: parseInt(_vm.$store.state.Page.total),
                "show-total": "",
                "page-size": 15
              },
              on: { "on-change": _vm.changePage }
            })
          ],
          1
        )
      : _vm._e(),
    _vm._v(" "),
    _vm.$store.state.Page.total === -1 && _vm.$route.name === "articleEdit"
      ? _c(
          "div",
          { staticClass: "button-group uk-flex uk-flex-around" },
          [
            _c(
              "Button",
              { attrs: { type: "primary" }, on: { click: _vm.postArticle } },
              [_vm._v("發佈提交")]
            ),
            _vm._v(" "),
            _c(
              "Button",
              { attrs: { type: "success" }, on: { click: _vm.saveArticle } },
              [_vm._v("保存草稿")]
            ),
            _vm._v(" "),
            _c("Button", { attrs: { type: "info" } }, [_vm._v("在線預覽")]),
            _vm._v(" "),
            _c(
              "Button",
              { attrs: { type: "error" }, on: { click: _vm.cancelArticle } },
              [_vm._v("清空刪除")]
            )
          ],
          1
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-439d8d46", module.exports)
  }
}

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(117)
  __webpack_require__(122)
}
var normalizeComponent = __webpack_require__(108)
/* script */
var __vue_script__ = __webpack_require__(125)
/* template */
var __vue_template__ = __webpack_require__(126)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-439d8d46"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/Manager.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-439d8d46", Component.options)
  } else {
    hotAPI.reload("data-v-439d8d46", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ })

});