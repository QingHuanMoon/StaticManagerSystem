webpackJsonp([8],{

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(173)
}
var normalizeComponent = __webpack_require__(108)
/* script */
var __vue_script__ = __webpack_require__(176)
/* template */
var __vue_template__ = __webpack_require__(177)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-22a52f1d"
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
Component.options.__file = "resources/assets/js/components/Pages/Register/Register.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-22a52f1d", Component.options)
  } else {
    hotAPI.reload("data-v-22a52f1d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

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

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(174);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(107)("0d162ced", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-22a52f1d\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/_less-loader@4.1.0@less-loader/dist/cjs.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=0!./Register.vue", function() {
     var newContent = require("!!../../../../../../node_modules/_css-loader@0.28.11@css-loader/index.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-22a52f1d\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../../node_modules/_less-loader@4.1.0@less-loader/dist/cjs.js!../../../../../../node_modules/_vue-loader@13.7.2@vue-loader/lib/selector.js?type=styles&index=0!./Register.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 174:
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(9);
exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.register-page[data-v-22a52f1d] {\n  width: 100%;\n  height: 100vh;\n}\n.register-page .register-container[data-v-22a52f1d] {\n  width: 100%;\n  height: 100%;\n}\n.register-page .register-container .register-card[data-v-22a52f1d] {\n  width: 10rem;\n  height: 6.5rem;\n  margin: 0;\n  padding: 0;\n}\n.register-page .register-container .register-card .register-form[data-v-22a52f1d] {\n  width: 3.82rem;\n  height: 100%;\n}\n.register-page .register-container .register-card .register-form form[data-v-22a52f1d] {\n  width: 90%;\n  height: 61.8%;\n}\n.register-page .register-container .register-card .register-form form button[data-v-22a52f1d] {\n  font-size: 0.16rem;\n  margin-top: 0.2rem;\n}\n.register-page .register-container .register-card .register-form form input[data-v-22a52f1d] {\n  width: 2.7rem;\n  font-size: 0.16rem;\n}\n.register-page .register-container .register-card .register-form form p[data-v-22a52f1d] {\n  font-size: 0.16rem;\n  margin-top: 0.1rem;\n}\n.register-page .register-container .register-card .register-img[data-v-22a52f1d] {\n  background: url(" + escape(__webpack_require__(175)) + ") no-repeat;\n  width: 6.18rem;\n  height: 100%;\n  background-size: cover;\n}\n", ""]);

// exports


/***/ }),

/***/ 175:
/***/ (function(module, exports) {

module.exports = "/images/whale-register.jpg?ca3b61300c56873c9d1a8684da3a3f34";

/***/ }),

/***/ 176:
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

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'Register',
  data: function data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirm: ''
      }
    };
  },

  methods: {
    register: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
        var _this = this;

        var _ref2, data;

        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return axios.post('/register', this.formData);

              case 2:
                _ref2 = _context.sent;
                data = _ref2.data;

                if (data.status === 200) {
                  this.$Notice.success({
                    title: data.title,
                    desc: data.msg
                  });
                  setTimeout(function () {
                    _this.$router.push({ path: '/login' });
                  }, 1000);
                }

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function register() {
        return _ref.apply(this, arguments);
      }

      return register;
    }()
  }
});

/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("section", { staticClass: "uk-section-muted register-page" }, [
    _c(
      "section",
      {
        staticClass:
          "uk-container-expand uk-container register-container uk-flex uk-flex-center uk-flex-middle"
      },
      [
        _c(
          "div",
          {
            staticClass:
              "uk-card uk-card-default uk-card-hover uk-card-body register-card uk-flex uk-flex-center"
          },
          [
            _c(
              "div",
              {
                staticClass:
                  "register-form uk-flex uk-flex-column uk-flex-middle uk-flex-center"
              },
              [
                _c(
                  "form",
                  {
                    staticClass:
                      "uk-flex uk-flex-column uk-flex-middle uk-flex-around",
                    attrs: { method: "POST" },
                    on: {
                      submit: function($event) {
                        $event.preventDefault()
                        return _vm.register($event)
                      }
                    }
                  },
                  [
                    _c("div", { staticClass: "uk-inline" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.formData.name,
                            expression: "formData.name"
                          },
                          {
                            name: "validate",
                            rawName: "v-validate",
                            value: { required: true, min: 2 },
                            expression: "{required: true, min: 2}"
                          }
                        ],
                        staticClass: "uk-input",
                        attrs: {
                          type: "text",
                          placeholder: "請輸入用戶名",
                          name: "name",
                          "data-vv-as": "用戶名"
                        },
                        domProps: { value: _vm.formData.name },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(_vm.formData, "name", $event.target.value)
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c(
                        "p",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: _vm.errors.has("name"),
                              expression: "errors.has('name')"
                            }
                          ],
                          staticClass:
                            "error uk-flex uk-flex-center uk-flex-middle"
                        },
                        [_vm._v(_vm._s(_vm.errors.first("name")))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "uk-inline" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.formData.email,
                            expression: "formData.email"
                          },
                          {
                            name: "validate",
                            rawName: "v-validate",
                            value: { required: true, email: true },
                            expression: "{required: true, email: true}"
                          }
                        ],
                        staticClass: "uk-input",
                        attrs: {
                          type: "text",
                          placeholder: "請輸入郵箱",
                          name: "email",
                          "data-vv-as": "郵箱"
                        },
                        domProps: { value: _vm.formData.email },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(_vm.formData, "email", $event.target.value)
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c(
                        "p",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: _vm.errors.has("email"),
                              expression: "errors.has('email')"
                            }
                          ],
                          staticClass:
                            "error uk-flex uk-flex-center uk-flex-middle"
                        },
                        [_vm._v(_vm._s(_vm.errors.first("email")))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "uk-inline" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.formData.password,
                            expression: "formData.password"
                          },
                          {
                            name: "validate",
                            rawName: "v-validate",
                            value: { required: true, min: 6 },
                            expression: "{required: true, min: 6}"
                          }
                        ],
                        staticClass: "uk-input",
                        attrs: {
                          type: "password",
                          placeholder: "請輸入密碼",
                          name: "password",
                          "data-vv-as": "密碼"
                        },
                        domProps: { value: _vm.formData.password },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.formData,
                              "password",
                              $event.target.value
                            )
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c(
                        "p",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: _vm.errors.has("password"),
                              expression: "errors.has('password')"
                            }
                          ],
                          staticClass:
                            "error uk-flex uk-flex-center uk-flex-middle"
                        },
                        [_vm._v(_vm._s(_vm.errors.first("password")))]
                      )
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "uk-inline" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.formData.confirm,
                            expression: "formData.confirm"
                          },
                          {
                            name: "validate",
                            rawName: "v-validate",
                            value: {
                              required: true,
                              min: 6,
                              confirmed: "password"
                            },
                            expression:
                              "{required: true, min: 6,confirmed: 'password' }"
                          }
                        ],
                        staticClass: "uk-input",
                        attrs: {
                          type: "password",
                          placeholder: "請輸入確認密碼",
                          name: "confirm",
                          "data-vv-as": "確認密碼"
                        },
                        domProps: { value: _vm.formData.confirm },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.formData,
                              "confirm",
                              $event.target.value
                            )
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c(
                        "p",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: _vm.errors.has("confirm"),
                              expression: "errors.has('confirm')"
                            }
                          ],
                          staticClass:
                            "error uk-flex uk-flex-center uk-flex-middle"
                        },
                        [_vm._v(_vm._s(_vm.errors.first("confirm")))]
                      )
                    ]),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "uk-button uk-button-primary",
                        attrs: { type: "submit" }
                      },
                      [_vm._v("註冊")]
                    )
                  ]
                )
              ]
            ),
            _vm._v(" "),
            _c("div", { staticClass: "register-img" })
          ]
        )
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-22a52f1d", module.exports)
  }
}

/***/ })

});