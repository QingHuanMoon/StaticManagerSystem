
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
window.Vue = require('vue');


import JWTToken from './helpers/JWTToken'

axios.interceptors.request.use(function (config) {
  if(JWTToken.getToken()) {
    config.headers['Authorization'] = 'Bearer ' + JWTToken.getToken();
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
axios.defaults.baseURL = window.location.origin + '/api';

import mavonEditor from 'mavon-editor'
import iView from 'iview'
import VuePrism from 'vue-prism'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
import zh_TW from 'vee-validate/dist/locale/zh_TW'
import VueQuillEditor from 'vue-quill-editor'



Vue.prototype.$ui = require('uikit')
const i18n = new VueI18n({
  locale: 'zh_TW',
})

Vue.use(iView).use(mavonEditor).use(VuePrism).use(VueI18n).use(VeeValidate, {
  fieldsBagName: 'veefields',
  i18n,
  i18nRootKey: 'validation',
  dictionary: {
    zh_TW
  }
}).use(VueQuillEditor)







import 'normalize.css/normalize.css'
import 'uikit/dist/css/uikit.css'
import 'iview/dist/styles/iview.css'
import 'mavon-editor/dist/css/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import router from './router/index'
import store from './storage/index'



/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */


const app = new Vue({
    el: '#app',
    router,
    store,
    created() {
      if(JWTToken.getToken()) {
        this.$store.dispatch('loginRequest')
      }
    }
});

