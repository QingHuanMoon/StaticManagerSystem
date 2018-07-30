import Vue from 'vue'
import VueRouter from 'vue-router'

import Store from '../storage/index'
import JWTToken from '../helpers/JWTToken'

Vue.use(VueRouter)


let routes =
  [
    {path: '/', name: 'Manager', component: r => require(['../components/Manager'], r), children: [
        {path: '/', name: 'UpdateInfo', component: r => require(['../components/Pages/Index/UpdateInfo/UpdateInfo'], r), meta: { requireAuth: true} },
        {path: '/User/UserTable',  name: 'userTable', component: r => require(['../components/Pages/User/UserTable/UserTable'], r), meta: { requireAuth: true }},
        {path: '/User/RoleTable', name: 'roleTable', component: r => require(['../components/Pages/User/RoleTable/RoleTable'], r), meta: { requireAuth: true }},
        {path: '/User/PermissionTable', name: 'permissionTable', component: r => require(['../components/Pages/User/PermissionTable/PermissionTable'], r), meta: { requireAuth: true }},
        {path: '/Info/GameTable', name: 'gameTable', component: r => require(['../components/Pages/Info/GameTable/GameTable'], r), meta: { requireAuth: true }},
        {path: '/Info/CateTable', name: 'cateTable', component: r => require(['../components/Pages/Info/CateTable/CateTable'], r), meta: { requireAuth: true }},
        {path: '/Info/TemplateTable', name: 'templateTable', component: r => require(['../components/Pages/Info/TemplateTable/TemplateTable'], r), meta: { requireAuth: true }},
        {path: '/Article/Edit', name: 'articleEdit', component: r => require(['../components/Pages/Article/Edit/Edit'], r), meta: { requireAuth: true }},
        {path: '/Article/Publish', name: 'articlePublish', component: r => require(['../components/Pages/Article/Publish/Publish'], r), meta: { requireAuth: true }}
    ]},
    {path: '/login', name: 'Login', component: r => require(['../components/Pages/Login/Login'], r)},
    {path: '/register', name: 'Register', component: r => require(['../components/Pages/Register/Register'], r)}
  ]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  Store.state.Page.isComplete = false;
  if( to.meta.requireAuth) {
    if( JWTToken.getToken()) {
      if(to.name !== 'Manager') {
        Store.state.Nav.navData.forEach(item => {
          item.childrenItem.forEach(smallItem => {
            if(smallItem.routerName === to.name) {
              Store.dispatch('addTag', smallItem)
            }
          })
        })
        return next();
      }
      return next();
    } else {
      return next({'name': 'Login'})
    }
  } else {
    next();
  }
})

export default router

