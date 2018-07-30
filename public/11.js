webpackJsonp([11],{

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(144)
}
var normalizeComponent = __webpack_require__(107)
/* script */
var __vue_script__ = __webpack_require__(146)
/* template */
var __vue_template__ = __webpack_require__(147)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-ee74eff8"
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
Component.options.__file = "resources/assets/js/components/Pages/Article/Edit/Edit.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ee74eff8", Component.options)
  } else {
    hotAPI.reload("data-v-ee74eff8", Component.options)
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

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(145);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(106)("29e63536", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ee74eff8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../../node_modules/less-loader/dist/cjs.js!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Edit.vue", function() {
     var newContent = require("!!../../../../../../../node_modules/css-loader/index.js!../../../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ee74eff8\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../../node_modules/less-loader/dist/cjs.js!../../../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./Edit.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 145:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.article-section[data-v-ee74eff8] {\n  font-size: 0.16rem !important;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n}\n.article-section .article-container[data-v-ee74eff8] {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n}\n.article-section .article-container .quill-editor[data-v-ee74eff8] {\n  width: 100%;\n  height: 66vh;\n}\n", ""]);

// exports


/***/ }),

/***/ 146:
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

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'articleEdit',
  data: function data() {
    return {
      editorOption: {
        // some quill options
      },
      postData: {
        game_id: '',
        cate_id: '',
        template_name: [],
        title: '',
        desc: '',
        img: '1',
        music: '1',
        author: '',
        status: '',
        content: ''
      },
      gameList: [],
      cateList: [],
      templateList: [],
      editStatus: false
    };
  },

  computed: {
    game_name: function game_name() {
      return this.gameList[this.postData.game_id - 1].label;
    },
    cate_name: function cate_name() {
      return this.cateList[this.postData.cate_id - 1].label;
    },
    getEditComplete: function getEditComplete() {
      return this.$store.state.Article.editComplete;
    },
    getEidtCancel: function getEidtCancel() {
      return this.$store.state.Article.editCancel;
    }
  },
  watch: {
    getEditComplete: function getEditComplete(val) {
      var _this = this;

      if (val) {
        this.postData.author = this.$store.state.Login.name;
        this.postData.template_name = this.postData.template_name.join(',');
        axios.post('/v1/article/store', { data: this.postData }).then(function (response) {
          if (response.status === 201) {
            _this.$Notice.success({
              title: '恭喜你,提交成功',
              desc: '頁面即將跳轉...'
            });
            _this.$store.dispatch('resetEditComplete');
            _this.$store.dispatch('cancelEditData');
            setTimeout(function () {
              _this.$router.push({ name: 'articlePublish' });
            }, 1500);
          }
        });
      }
    },
    getEidtCancel: function getEidtCancel(val) {
      if (val) {
        this.postData.content = '';
      }
    }
  },
  methods: {
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
    onEditorBlur: function onEditorBlur($event) {
      console.log($event);
    },
    onEditorFocus: function onEditorFocus($event) {
      console.log($event);
    },
    onEditorReady: function onEditorReady($event) {
      console.log($event);
    },
    setAuthor: function setAuthor() {
      this.postData.author = this.$store.state.Login.name;
    },
    editOK: function editOK() {
      this.editStatus = true;
      this.$store.state.Article.isShow = false;
      this.$store.dispatch('setStoreInfo', {
        data: this.postData,
        gameName: this.game_name,
        cateName: this.cate_name
      });
    },
    editCancel: function editCancel() {
      console.log('cancel');
    },
    getTemplateList: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee3() {
        var _ref6, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.templateList = [];
                _context3.next = 3;
                return axios.get('v1/article/get/templatelist', {
                  params: {
                    'game_id': this.postData.game_id
                  }
                });

              case 3:
                _ref6 = _context3.sent;
                data = _ref6.data;

                this.templateList = data;

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getTemplateList() {
        return _ref5.apply(this, arguments);
      }

      return getTemplateList;
    }()
  },
  beforeCreate: function beforeCreate() {
    this.$nextTick(function () {
      this.initCate();
      this.initGame();
      this.setAuthor();
    });
  }
});

/***/ }),

/***/ 147:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "section",
    { staticClass: "uk-section article-section" },
    [
      !_vm.editStatus
        ? _c("Spin", { attrs: { size: "large", fix: "" } })
        : _vm._e(),
      _vm._v(" "),
      _c(
        "section",
        { staticClass: "uk-container uk-container-expand article-container" },
        [
          _c("quill-editor", {
            ref: "myQuillEditor",
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
              value: _vm.postData.content,
              callback: function($$v) {
                _vm.$set(_vm.postData, "content", $$v)
              },
              expression: "postData.content"
            }
          }),
          _vm._v(" "),
          _c(
            "Modal",
            {
              on: { "on-ok": _vm.editOK, "on-cancel": _vm.editCancel },
              model: {
                value: _vm.$store.state.Article.isShow,
                callback: function($$v) {
                  _vm.$set(_vm.$store.state.Article, "isShow", $$v)
                },
                expression: "$store.state.Article.isShow"
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
                            value: _vm.postData.game_id,
                            callback: function($$v) {
                              _vm.$set(_vm.postData, "game_id", $$v)
                            },
                            expression: "postData.game_id"
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
                            value: _vm.postData.cate_id,
                            callback: function($$v) {
                              _vm.$set(_vm.postData, "cate_id", $$v)
                            },
                            expression: "postData.cate_id"
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
                            value: _vm.postData.template_name,
                            callback: function($$v) {
                              _vm.$set(_vm.postData, "template_name", $$v)
                            },
                            expression: "postData.template_name"
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
                          value: _vm.postData.title,
                          callback: function($$v) {
                            _vm.$set(_vm.postData, "title", $$v)
                          },
                          expression: "postData.title"
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
                          value: _vm.postData.desc,
                          callback: function($$v) {
                            _vm.$set(_vm.postData, "desc", $$v)
                          },
                          expression: "postData.desc"
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
          )
        ],
        1
      )
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
    require("vue-hot-reload-api")      .rerender("data-v-ee74eff8", module.exports)
  }
}

/***/ })

});