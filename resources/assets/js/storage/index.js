import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Login from './modules/login'
import Nav from './modules/nav'
import Page from './modules/page'
import Table from './modules/table'
import API from './modules/APIS'
import Article from './modules/article'

export default new Vuex.Store({
  modules: {
    Login, Nav, Page, Table, API, Article
  }
})