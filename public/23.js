webpackJsonp([23],{

/***/ 103:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(163)
}
var normalizeComponent = __webpack_require__(107)
/* script */
var __vue_script__ = __webpack_require__(165)
/* template */
var __vue_template__ = __webpack_require__(166)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-05dc1324"
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
Component.options.__file = "resources/assets/js/components/Pages/Article/Publish/Publish.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-05dc1324", Component.options)
  } else {
    hotAPI.reload("data-v-05dc1324", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 106:
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

var listToStyles = __webpack_require__(108)

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

/***/ 107:
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

/***/ 108:
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

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(164);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(106)("43f37d0a", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-05dc1324\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../../node_modules/less-loader/dist/cjs.js!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Publish.vue", function() {
     var newContent = require("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-05dc1324\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../../node_modules/less-loader/dist/cjs.js!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Publish.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 164:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.publish-section[data-v-05dc1324] {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  background-color: red;\n}\n.publish-section .publish-container[data-v-05dc1324] {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  background-color: blue;\n}\n.publish-section .publish-container .list[data-v-05dc1324] {\n  width: 38.2%;\n  height: 100%;\n  background-color: yellow;\n}\n.publish-section .publish-container .list .game[data-v-05dc1324] {\n  width: 61.8%;\n  height: 100%;\n  background-color: dodgerblue;\n}\n.publish-section .publish-container .list .game .game-card[data-v-05dc1324] {\n  width: 100%;\n  height: 100%;\n  overflow-y: auto;\n}\n.publish-section .publish-container .list .game .game-card .game-list li[data-v-05dc1324] {\n  font-size: 0.2rem;\n}\n.publish-section .publish-container .list .game .game-card .game-list li[data-v-05dc1324]:hover {\n  color: palevioletred;\n  cursor: pointer;\n}\n.publish-section .publish-container .list .cate[data-v-05dc1324] {\n  width: 38.2%;\n  height: 100%;\n  background-color: aquamarine;\n}\n.publish-section .publish-container .list .cate .cate-card[data-v-05dc1324] {\n  width: 100%;\n  height: 100%;\n  overflow-y: auto;\n}\n.publish-section .publish-container .list .cate .cate-card .cate-list li[data-v-05dc1324] {\n  font-size: 0.2rem;\n}\n.publish-section .publish-container .list .cate .cate-card .cate-list li[data-v-05dc1324]:hover {\n  color: deepskyblue;\n  cursor: pointer;\n}\n.publish-section .publish-container .content[data-v-05dc1324] {\n  width: 61.8%;\n  height: 100%;\n  background-color: purple;\n}\n.publish-section .publish-container .content .content-card[data-v-05dc1324] {\n  width: 100%;\n  height: 100%;\n  overflow-y: auto;\n}\n.publish-section .publish-container .content .content-card .article-list[data-v-05dc1324] {\n  margin-top: 0.1rem;\n}\n.publish-section .publish-container .content .content-card .article-list li[data-v-05dc1324] {\n  margin-top: 0.1rem;\n}\n.publish-section .publish-container .content .content-card .article-list li .header .title[data-v-05dc1324] {\n  font-size: 0.3rem;\n}\n.publish-section .publish-container .content .content-card .article-list li .header .btns i[data-v-05dc1324] {\n  margin-right: 0.1rem;\n}\n.publish-section .publish-container .content .content-card .article-list li .header .btns i[data-v-05dc1324]:hover {\n  color: lightcoral;\n}\n.publish-section .publish-container .content .content-card .article-list li .desc[data-v-05dc1324] {\n  font-size: 0.16rem;\n  margin-top: 0.2rem;\n  padding-left: 0.5rem;\n}\n.publish-section .publish-container .content .content-card .article-list li .author[data-v-05dc1324] {\n  font-size: 0.18rem;\n  font-weight: 800;\n  margin-top: 0.5rem;\n}\n.cache[data-v-05dc1324] {\n  color: deepskyblue;\n}\n.is-publish[data-v-05dc1324] {\n  color: #abdde5;\n}\n#modal-full[data-v-05dc1324] {\n  width: 100%;\n  height: auto;\n  min-height: 100vh;\n}\n#modal-full .uk-modal-dialog[data-v-05dc1324] {\n  width: 100%;\n  height: 100%;\n  min-height: 100vh;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.cache-list[data-v-05dc1324] {\n  margin: 0;\n}\n.cache-list li[data-v-05dc1324] {\n  height: 40px;\n  line-height: 30px;\n}\n", ""]);

// exports


/***/ }),

/***/ 165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);


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
  name: 'articlePublish',
  data: function data() {
    return {
      ArticleGameList: [],
      ArticleCateList: [],
      ArticleList: [],
      TemplateList: [],
      cacheInfo: [],
      cacheList: [],
      gameList: [],
      cateList: [],
      templateList: [],
      gameId: '',
      cateId: '',
      prerenderTemp: '',
      viewUrl: '',
      articleObj: {},
      viewMask: false,
      setMask: false,
      editMask: false,
      refreshMask: false,
      editorOption: {
        // some quill options
      }
    };
  },

  methods: {
    onEditorBlur: function onEditorBlur($event) {
      console.log($event);
    },
    onEditorFocus: function onEditorFocus($event) {
      console.log($event);
    },
    onEditorReady: function onEditorReady($event) {
      console.log($event);
    },
    initGame: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
        var _ref2, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return axios.get('/v1/game/get');

              case 2:
                _ref2 = _context.sent;
                data = _ref2.data;

                this.gameList = data.data;

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function initGame() {
        return _ref.apply(this, arguments);
      }

      return initGame;
    }(),
    initCate: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee2() {
        var _ref4, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return axios.get('/v1/cate/get');

              case 2:
                _ref4 = _context2.sent;
                data = _ref4.data;

                this.cateList = data.data;

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function initCate() {
        return _ref3.apply(this, arguments);
      }

      return initCate;
    }(),
    getGameList: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee3() {
        var _ref6, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return axios.get('/v1/article/get/gamelist');

              case 2:
                _ref6 = _context3.sent;
                data = _ref6.data;

                this.ArticleGameList = data;

              case 5:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getGameList() {
        return _ref5.apply(this, arguments);
      }

      return getGameList;
    }(),
    getCateList: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee4(id) {
        var _ref8, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                this.ArticleCateList = [];
                this.ArticleList = [];
                this.gameId = id;
                _context4.next = 5;
                return axios.get('/v1/article/get/catelist', { params: { game_id: id } });

              case 5:
                _ref8 = _context4.sent;
                data = _ref8.data;

                this.ArticleCateList = data;

              case 8:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getCateList(_x) {
        return _ref7.apply(this, arguments);
      }

      return getCateList;
    }(),
    getArticle: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee5(id) {
        var _ref10, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.ArticleList = [];
                this.cateId = id;
                _context5.next = 4;
                return axios.get('/v1/article/get/articlelist', { params: {
                    game_id: this.gameId,
                    cate_id: this.cateId
                  }
                });

              case 4:
                _ref10 = _context5.sent;
                data = _ref10.data;

                this.ArticleList = data;

              case 7:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getArticle(_x2) {
        return _ref9.apply(this, arguments);
      }

      return getArticle;
    }(),


    // 檢查緩存
    checkCache: function checkCache(id) {
      var _this = this;

      this.cacheInfo = [];
      this.refreshMask = true;
      axios.post('/v1/article/cache/check', {
        id: id
      }).then(function (res) {
        _this.cacheInfo = res.data;
      });
    },


    // 重建緩存
    refreshCache: function refreshCache(id, template_name) {
      var _this2 = this;

      axios.post('/v1/article/cache/refresh', {
        id: id,
        template_name: template_name
      }).then(function (res) {
        if (res.status === 200) {
          _this2.checkCache(id);
        }
      });
    },
    viewMaskOk: function viewMaskOk() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var template_name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      this.viewUrl = '';
      if (id !== '' && template_name !== '') {
        this.viewUrl = location.origin + '/article/' + id + '/' + template_name;
        this.$ui.modal('#modal-full').show();
      } else {
        this.viewUrl = location.origin + '/article/' + this.articleObj.id + '/' + this.prerenderTemp;
        this.$ui.modal('#modal-full').show();
        this.viewMask = false;
      }
    },


    // 刪除緩存
    removeCache: function removeCache(id, template_name) {
      var _this3 = this;

      axios.post('/v1/article/cache/remove/' + template_name + '/' + id).then(function (res) {
        if (res.status === 200) {
          _this3.checkCache(id);
        }
      });
    },


    // 刪除文章及緩存
    deleteAll: function deleteAll(id) {
      var _this4 = this;

      this.$Modal.confirm({
        title: '你正在刪除文件',
        content: '<p>\u4F60\u78BA\u5B9A\u8981\u522A\u9664\u6587\u7AE0\u53CA\u6240\u6709\u7DE9\u5B58\u55CE?</p>',
        okText: '確認',
        cancelText: '撤銷',
        loading: true,
        onOk: function onOk() {
          axios.post('v1/article/destroy', {
            'id': id
          }).then(function (response) {
            if (response.status === 200) {
              _this4.$Modal.remove();
              _this4.$Notice.success({
                title: response.data.msg,
                desc: '頁面將更新數據...'
              });
              _this4.getGameList();
              _this4.getCateList(_this4.gameId);
              _this4.getArticle(_this4.articleObj.cate_id);
            }
          });
        }
      });
    },
    viewArticle: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee6(id) {
        var _ref12, data, newRes, i;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                this.TemplateList = [];
                this.prerenderTemp = '';
                this.articleObj.id = id;
                _context6.next = 5;
                return axios.get('/v1/article/review', {
                  params: {
                    id: id
                  }
                });

              case 5:
                _ref12 = _context6.sent;
                data = _ref12.data;
                newRes = data.template_name.split(',');

                for (i = 0; i < newRes.length; i++) {
                  this.TemplateList[i] = { 'value': newRes[i], 'label': newRes[i] };
                }
                this.viewMask = true;

              case 10:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function viewArticle(_x5) {
        return _ref11.apply(this, arguments);
      }

      return viewArticle;
    }(),
    showSetting: function showSetting(id) {
      var _this5 = this;

      axios.get('/v1/article/review', {
        params: {
          id: id
        }
      }).then(function (response) {
        _this5.articleObj = response.data;
        _this5.getTemplateList();
        var newRes = response.data.template_name.split(',');
        _this5.articleObj.template_name = [];
        for (var i = 0; i < newRes.length; i++) {
          _this5.TemplateList[i] = { 'value': newRes[i], 'label': newRes[i] };
          _this5.articleObj.template_name.push(newRes[i]);
        }
        if (_this5.articleObj.template_name.length > 0) {
          _this5.setMask = true;
        }
      });
    },
    setInfo: function setInfo(id) {
      var _this6 = this;

      axios.post('/v1/article/update', {
        id: id,
        data: this.articleObj
      }).then(function (response) {
        if (response.status === 200) {
          _this6.$Notice.success({
            title: response.data.msg,
            desc: '頁面將更新數據...'
          });
          _this6.getGameList();
          _this6.getCateList(_this6.gameId);
          _this6.getArticle(_this6.articleObj.cate_id);
        }
      });
    },
    showArticleMask: function showArticleMask(id) {
      var _this7 = this;

      axios.get('/v1/article/review', {
        params: {
          id: id
        }
      }).then(function (response) {
        _this7.articleObj = response.data;
        _this7.editMask = true;
      });
    },
    changeArticle: function changeArticle(id) {
      var _this8 = this;

      axios.post('/v1/article/update', {
        id: id,
        data: this.articleObj
      }).then(function (response) {
        if (response.status === 200) {
          _this8.$Notice.success({
            title: response.data.msg,
            desc: '頁面將更新數據...'
          });
          _this8.getArticle(_this8.articleObj.cate_id);
        }
      });
    },
    publishArticle: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee8(id, index) {
        var _this9 = this;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                axios.get('/v1/article/review', {
                  params: {
                    id: id
                  }
                }).then(function () {
                  var _ref14 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee7(response) {
                    var _ref15, data;

                    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            _this9.articleObj = response.data;
                            _context7.next = 3;
                            return axios.get('v1/article/publish', {
                              params: {
                                id: id
                              }
                            });

                          case 3:
                            _ref15 = _context7.sent;
                            data = _ref15.data;

                            if (data.status === 208) {
                              _this9.ArticleList[index].status = data.cur;
                              _this9.articleObj.status = data.cur;
                              _this9.$Notice.success({
                                title: data.msg
                              });
                            } else if (data.status === 209) {
                              _this9.articleObj.status = data.cur;
                              _this9.ArticleList[index].status = data.cur;
                              _this9.$Notice.success({
                                title: data.msg
                              });
                            }

                          case 6:
                          case 'end':
                            return _context7.stop();
                        }
                      }
                    }, _callee7, _this9);
                  }));

                  return function (_x8) {
                    return _ref14.apply(this, arguments);
                  };
                }());

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function publishArticle(_x6, _x7) {
        return _ref13.apply(this, arguments);
      }

      return publishArticle;
    }(),
    getTemplateList: function () {
      var _ref16 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee9() {
        var _ref17, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                this.templateList = [];
                _context9.next = 3;
                return axios.get('v1/article/get/templatelist', {
                  params: {
                    'game_id': this.articleObj.game_id
                  }
                });

              case 3:
                _ref17 = _context9.sent;
                data = _ref17.data;

                this.templateList = data;

              case 6:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getTemplateList() {
        return _ref16.apply(this, arguments);
      }

      return getTemplateList;
    }()
  },

  created: function created() {
    this.getGameList();
  },
  mounted: function mounted() {
    this.initGame();
    this.initCate();
  }
});

/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("section", { staticClass: "uk-section publish-section" }, [
    _c(
      "div",
      {
        staticClass: "uk-modal-full",
        attrs: { id: "modal-full", "uk-modal": "" }
      },
      [
        _c("div", { staticClass: "uk-modal-dialog" }, [
          _c("button", {
            staticClass: "uk-modal-close-full uk-close-large",
            attrs: { type: "button", "uk-close": "" }
          }),
          _vm._v(" "),
          _c("iframe", {
            staticStyle: { width: "100%", height: "100%" },
            attrs: { src: _vm.viewUrl, frameborder: "0" }
          })
        ])
      ]
    ),
    _vm._v(" "),
    _c(
      "section",
      {
        staticClass:
          "uk-container uk-container-expand publish-container uk-flex"
      },
      [
        _c("div", { staticClass: "list uk-flex" }, [
          _c("div", { staticClass: "game" }, [
            _c(
              "div",
              {
                staticClass:
                  "uk-card uk-card-default uk-card-hover uk-card-body game-card"
              },
              [
                _c(
                  "ul",
                  { staticClass: "uk-list uk-list-divider game-list" },
                  _vm._l(_vm.ArticleGameList, function(item, index) {
                    return _c(
                      "li",
                      {
                        key: index,
                        staticClass: "uk-text-center",
                        on: {
                          click: function($event) {
                            _vm.getCateList(item.id)
                          }
                        }
                      },
                      [_vm._v(_vm._s(item.name))]
                    )
                  })
                )
              ]
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "cate" }, [
            _c(
              "div",
              {
                staticClass:
                  "uk-card uk-card-default uk-card-hover uk-card-body cate-card"
              },
              [
                _c(
                  "ul",
                  { staticClass: "uk-list uk-list-divider cate-list" },
                  _vm._l(_vm.ArticleCateList, function(item, index) {
                    return _c(
                      "li",
                      {
                        key: index,
                        staticClass: "uk-text-center",
                        on: {
                          click: function($event) {
                            _vm.getArticle(item.id)
                          }
                        }
                      },
                      [_vm._v(_vm._s(item.name))]
                    )
                  })
                )
              ]
            )
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "content" }, [
          _c(
            "div",
            {
              staticClass:
                "uk-card uk-card-default uk-card-hover uk-card-body content-card"
            },
            [
              _c(
                "ul",
                { staticClass: "uk-list uk-list-divider article-list" },
                _vm._l(_vm.ArticleList, function(item, index) {
                  return _c("li", { key: index }, [
                    _c(
                      "div",
                      { staticClass: "header uk-flex uk-flex-between" },
                      [
                        _c(
                          "p",
                          { staticClass: "title" },
                          [
                            _c("Icon", {
                              class: [item.isCached ? "cache" : "no-cache"],
                              attrs: { type: "ios-heart" }
                            }),
                            _vm._v(" " + _vm._s(item.title))
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "btns uk-flex" },
                          [
                            _c("Icon", {
                              attrs: { size: "26", type: "edit" },
                              on: {
                                click: function($event) {
                                  _vm.showArticleMask(item.id)
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c("Icon", {
                              attrs: {
                                size: "26",
                                type: "social-vimeo-outline"
                              },
                              on: {
                                click: function($event) {
                                  _vm.viewArticle(item.id)
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c("Icon", {
                              attrs: {
                                size: "26",
                                type: "ios-refresh-outline"
                              },
                              on: {
                                click: function($event) {
                                  _vm.checkCache(item.id)
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c("Icon", {
                              attrs: { size: "26", type: "ios-gear-outline" },
                              on: {
                                click: function($event) {
                                  _vm.showSetting(item.id)
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c("Icon", {
                              attrs: { size: "26", type: "ios-trash-outline" },
                              on: {
                                click: function($event) {
                                  _vm.deleteAll(item.id)
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c("Icon", {
                              class: [
                                item.status === 1
                                  ? "is-publish"
                                  : "isnt-publish"
                              ],
                              attrs: {
                                size: "26",
                                type: "ios-paperplane-outline"
                              },
                              on: {
                                click: function($event) {
                                  _vm.publishArticle(item.id, index)
                                }
                              }
                            })
                          ],
                          1
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c("div", { staticClass: "desc" }, [
                      _c("p", [_vm._v(_vm._s(item.desc))])
                    ]),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticClass: "author uk-flex uk-flex-between" },
                      [
                        _c("p", [
                          _vm._v(
                            _vm._s(
                              _vm.$store.state.Article.status[item.status].label
                            )
                          )
                        ]),
                        _vm._v(" "),
                        _c("p", [_vm._v(_vm._s(item.author))])
                      ]
                    )
                  ])
                })
              )
            ]
          )
        ]),
        _vm._v(" "),
        _c(
          "Modal",
          {
            attrs: { title: "選擇需要預覽的模板" },
            on: { "on-ok": _vm.viewMaskOk },
            model: {
              value: _vm.viewMask,
              callback: function($$v) {
                _vm.viewMask = $$v
              },
              expression: "viewMask"
            }
          },
          [
            _c(
              "Select",
              {
                model: {
                  value: _vm.prerenderTemp,
                  callback: function($$v) {
                    _vm.prerenderTemp = $$v
                  },
                  expression: "prerenderTemp"
                }
              },
              _vm._l(_vm.TemplateList, function(item, index) {
                return _c(
                  "Option",
                  { key: index, attrs: { value: item.value } },
                  [_vm._v(_vm._s(item.label))]
                )
              })
            )
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "Modal",
          {
            attrs: { title: "設置" },
            on: {
              "on-ok": function($event) {
                _vm.setInfo(_vm.articleObj.id)
              }
            },
            model: {
              value: _vm.setMask,
              callback: function($$v) {
                _vm.setMask = $$v
              },
              expression: "setMask"
            }
          },
          [
            _c(
              "Row",
              [
                _c("Col", { attrs: { span: "4" } }, [
                  _c("span", { staticStyle: { "font-size": ".16rem" } }, [
                    _vm._v("所屬遊戲")
                  ])
                ]),
                _vm._v(" "),
                _c(
                  "Col",
                  { attrs: { span: "20" } },
                  [
                    _c(
                      "Select",
                      {
                        on: { "on-change": _vm.getTemplateList },
                        model: {
                          value: _vm.articleObj.game_id,
                          callback: function($$v) {
                            _vm.$set(_vm.articleObj, "game_id", $$v)
                          },
                          expression: "articleObj.game_id"
                        }
                      },
                      _vm._l(_vm.gameList, function(item, index) {
                        return _c(
                          "Option",
                          { key: index, attrs: { value: item.value } },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    )
                  ],
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "Row",
              { staticStyle: { "margin-top": ".2rem" } },
              [
                _c("Col", { attrs: { span: "4" } }, [
                  _c("span", { staticStyle: { "font-size": ".16rem" } }, [
                    _vm._v("所屬分類")
                  ])
                ]),
                _vm._v(" "),
                _c(
                  "Col",
                  { attrs: { span: "20" } },
                  [
                    _c(
                      "Select",
                      {
                        model: {
                          value: _vm.articleObj.cate_id,
                          callback: function($$v) {
                            _vm.$set(_vm.articleObj, "cate_id", $$v)
                          },
                          expression: "articleObj.cate_id"
                        }
                      },
                      _vm._l(_vm.cateList, function(item, index) {
                        return _c(
                          "Option",
                          { key: index, attrs: { value: item.value } },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    )
                  ],
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "Row",
              { staticStyle: { "margin-top": ".2rem" } },
              [
                _c("Col", { attrs: { span: "4" } }, [
                  _c("span", { staticStyle: { "font-size": ".16rem" } }, [
                    _vm._v("所屬模板")
                  ])
                ]),
                _vm._v(" "),
                _c(
                  "Col",
                  { attrs: { span: "20" } },
                  [
                    _c(
                      "Select",
                      {
                        attrs: { multiple: "" },
                        model: {
                          value: _vm.articleObj.template_name,
                          callback: function($$v) {
                            _vm.$set(_vm.articleObj, "template_name", $$v)
                          },
                          expression: "articleObj.template_name"
                        }
                      },
                      _vm._l(_vm.templateList, function(item, index) {
                        return _c(
                          "Option",
                          { key: index, attrs: { value: item.value } },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    )
                  ],
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "Row",
              { staticStyle: { "margin-top": ".2rem" } },
              [
                _c("Col", { attrs: { span: "4" } }, [
                  _c("span", { staticStyle: { "font-size": ".16rem" } }, [
                    _vm._v("標題")
                  ])
                ]),
                _vm._v(" "),
                _c(
                  "Col",
                  { attrs: { span: "20" } },
                  [
                    _c("i-input", {
                      attrs: { placeholder: "Enter something..." },
                      model: {
                        value: _vm.articleObj.title,
                        callback: function($$v) {
                          _vm.$set(_vm.articleObj, "title", $$v)
                        },
                        expression: "articleObj.title"
                      }
                    })
                  ],
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "Row",
              { staticStyle: { "margin-top": ".2rem" } },
              [
                _c("Col", { attrs: { span: "4" } }, [
                  _c("span", { staticStyle: { "font-size": ".16rem" } }, [
                    _vm._v("簡介")
                  ])
                ]),
                _vm._v(" "),
                _c(
                  "Col",
                  { attrs: { span: "20" } },
                  [
                    _c("i-input", {
                      attrs: {
                        placeholder: "Enter something...",
                        type: "textarea"
                      },
                      model: {
                        value: _vm.articleObj.desc,
                        callback: function($$v) {
                          _vm.$set(_vm.articleObj, "desc", $$v)
                        },
                        expression: "articleObj.desc"
                      }
                    })
                  ],
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "Row",
              { staticStyle: { "margin-top": ".2rem" } },
              [
                _c("Col", { attrs: { span: "4" } }, [
                  _c("span", { staticStyle: { "font-size": ".16rem" } }, [
                    _vm._v("圖片")
                  ])
                ]),
                _vm._v(" "),
                _c(
                  "Col",
                  { attrs: { span: "20" } },
                  [
                    _c(
                      "Upload",
                      {
                        attrs: {
                          multiple: "",
                          action: "//jsonplaceholder.typicode.com/posts/"
                        }
                      },
                      [
                        _c(
                          "Button",
                          {
                            attrs: {
                              type: "ghost",
                              icon: "ios-cloud-upload-outline"
                            }
                          },
                          [_vm._v("上傳圖片")]
                        )
                      ],
                      1
                    )
                  ],
                  1
                )
              ],
              1
            ),
            _vm._v(" "),
            _c(
              "Row",
              { staticStyle: { "margin-top": ".2rem" } },
              [
                _c("Col", { attrs: { span: "4" } }, [
                  _c("span", { staticStyle: { "font-size": ".16rem" } }, [
                    _vm._v("背景音樂")
                  ])
                ]),
                _vm._v(" "),
                _c(
                  "Col",
                  { attrs: { span: "20" } },
                  [
                    _c(
                      "Upload",
                      {
                        attrs: {
                          action: "//jsonplaceholder.typicode.com/posts/"
                        }
                      },
                      [
                        _c(
                          "Button",
                          {
                            attrs: {
                              type: "ghost",
                              icon: "ios-cloud-upload-outline"
                            }
                          },
                          [_vm._v("上傳音樂")]
                        )
                      ],
                      1
                    )
                  ],
                  1
                )
              ],
              1
            )
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "Modal",
          {
            attrs: { title: "編輯文章", width: "1200" },
            on: {
              "on-ok": function($event) {
                _vm.changeArticle(_vm.articleObj.id)
              }
            },
            model: {
              value: _vm.editMask,
              callback: function($$v) {
                _vm.editMask = $$v
              },
              expression: "editMask"
            }
          },
          [
            _c("quill-editor", {
              ref: "mySecQuillEditor",
              attrs: { options: _vm.editorOption },
              on: {
                blur: function($event) {
                  _vm.onEditorBlur($event)
                },
                focus: function($event) {
                  _vm.onEditorFocus($event)
                },
                ready: function($event) {
                  _vm.onEditorReady($event)
                }
              },
              model: {
                value: _vm.articleObj.content,
                callback: function($$v) {
                  _vm.$set(_vm.articleObj, "content", $$v)
                },
                expression: "articleObj.content"
              }
            })
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "Modal",
          {
            attrs: { title: "重建緩存", "on-ok": "reBuild", width: "1200" },
            model: {
              value: _vm.refreshMask,
              callback: function($$v) {
                _vm.refreshMask = $$v
              },
              expression: "refreshMask"
            }
          },
          [
            _c(
              "Row",
              { staticStyle: { "font-size": ".16rem" } },
              [
                _c("Spin", {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !_vm.cacheInfo.length,
                      expression: "!cacheInfo.length"
                    }
                  ],
                  attrs: { fix: "" }
                }),
                _vm._v(" "),
                _c("Col", { attrs: { span: "24" } }, [
                  _c(
                    "ul",
                    {
                      staticClass:
                        "uk-list uk-list-divider uk-text-center cache-list"
                    },
                    [
                      _c(
                        "li",
                        [
                          _c(
                            "Row",
                            [
                              _c("Col", { attrs: { span: "3" } }, [
                                _vm._v(
                                  "\n                            序號\n                          "
                                )
                              ]),
                              _vm._v(" "),
                              _c("Col", { attrs: { span: "4" } }, [
                                _vm._v(
                                  "\n                            模板名稱\n                          "
                                )
                              ]),
                              _vm._v(" "),
                              _c("Col", { attrs: { span: "3" } }, [
                                _vm._v(
                                  "\n                            是否緩存\n                          "
                                )
                              ]),
                              _vm._v(" "),
                              _c("Col", { attrs: { span: "6" } }, [
                                _vm._v(
                                  "\n                            緩存時間\n                          "
                                )
                              ]),
                              _vm._v(" "),
                              _c("Col", { attrs: { span: "6" } }, [
                                _vm._v(
                                  "\n                            操作選項\n                          "
                                )
                              ])
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _vm._l(_vm.cacheInfo, function(item, index) {
                        return _c(
                          "li",
                          { key: index },
                          [
                            _c(
                              "Row",
                              [
                                _c("Col", { attrs: { span: "3" } }, [
                                  _vm._v(
                                    "\n                            " +
                                      _vm._s(item.id) +
                                      "\n                          "
                                  )
                                ]),
                                _vm._v(" "),
                                _c("Col", { attrs: { span: "4" } }, [
                                  _vm._v(
                                    "\n                            " +
                                      _vm._s(item.templateName) +
                                      "\n                          "
                                  )
                                ]),
                                _vm._v(" "),
                                _c(
                                  "Col",
                                  { attrs: { span: "3" } },
                                  [
                                    _c("Icon", {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: item.isCached,
                                          expression: "item.isCached"
                                        }
                                      ],
                                      attrs: { type: "checkmark-round" }
                                    }),
                                    _vm._v(" "),
                                    _c("Icon", {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: !item.isCached,
                                          expression: "!item.isCached"
                                        }
                                      ],
                                      attrs: { type: "close-round" }
                                    })
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c("Col", { attrs: { span: "6" } }, [
                                  _c(
                                    "span",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: item.isCached,
                                          expression: "item.isCached"
                                        }
                                      ]
                                    },
                                    [_vm._v(_vm._s(item.finalTime))]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "span",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: !item.isCached,
                                          expression: "!item.isCached"
                                        }
                                      ]
                                    },
                                    [_vm._v("  ")]
                                  )
                                ]),
                                _vm._v(" "),
                                _c(
                                  "Col",
                                  { attrs: { span: "2" } },
                                  [
                                    _c(
                                      "Button",
                                      {
                                        attrs: { type: "success" },
                                        on: {
                                          click: function($event) {
                                            _vm.refreshCache(
                                              item.id,
                                              item.templateName
                                            )
                                          }
                                        }
                                      },
                                      [_vm._v("重建緩存")]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "Col",
                                  { attrs: { span: "2" } },
                                  [
                                    _c(
                                      "Button",
                                      {
                                        attrs: {
                                          type: "info",
                                          disabled: !item.isCached
                                        },
                                        on: {
                                          click: function($event) {
                                            _vm.viewMaskOk(
                                              item.id,
                                              item.templateName
                                            )
                                          }
                                        }
                                      },
                                      [_vm._v("查看緩存")]
                                    )
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "Col",
                                  { attrs: { span: "2" } },
                                  [
                                    _c(
                                      "Button",
                                      {
                                        attrs: {
                                          type: "error",
                                          disabled: !item.isCached
                                        },
                                        on: {
                                          click: function($event) {
                                            _vm.removeCache(
                                              item.id,
                                              item.templateName
                                            )
                                          }
                                        }
                                      },
                                      [_vm._v("刪除緩存")]
                                    )
                                  ],
                                  1
                                )
                              ],
                              1
                            )
                          ],
                          1
                        )
                      })
                    ],
                    2
                  )
                ])
              ],
              1
            )
          ],
          1
        )
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-05dc1324", module.exports)
  }
}

/***/ })

});