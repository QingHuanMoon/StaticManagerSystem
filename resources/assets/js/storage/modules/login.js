import JWTToken from '../../helpers/JWTToken'
import * as Types from './mutation-type'
import Store from '../../storage/index'


const state = {
  Authenticate: false,
  id: '',
  name: '',
  email: '',
}


const mutations = {
  [Types.SET_AUTH_USER](state, payload) {
    console.log(payload)
    state.Authenticate = true
    state.name = payload.response.data.name
    state.email = payload.response.data.email
    state.id = payload.response.data.id
  },
  [Types.UNSET_AUTH_USER](state) {
    state.Authenticate = false
    state.name = null
    state.email = null
    state.id = null
  }
}

const actions = {
  loginRequest({commit, dispatch}, formData) {
    if(!JWTToken.getToken()) {
      axios.post('/login', formData).then(response => {
        if (response.status === 200) {
          JWTToken.setToken(response.data.token)
          axios.get('/user').then((response) => {
            commit({
              type: Types.SET_AUTH_USER, response
            })
          })
        }
      }).catch(error => {
        console.log(error)
      })
    } else  {
      axios.get('/user').then(response => {
        commit({
          type: Types.SET_AUTH_USER, response
        })
      }).catch( error => {
        dispatch('refreshLogin')
      })
    }
  },
  async logoutRequest({commit, dispatch}) {
    JWTToken.removeToken();
    Store.state.Nav.tagData = [];
    Store.state.Nav.curChild = ''
    Store.state.Nav.curFather = ''
    commit({
      type: Types.UNSET_AUTH_USER
    })

  },
  async refreshLogin({commit, dispatch}) {
    axios.post('/token/refresh').then( response => {
      if(response.status === 200) {
        JWTToken.setToken(response.data.token);
        commit({
          type: Types.SET_AUTH_USER, response
        })
      } else {
        dispatch('logoutRequest')
      }
    })
  }
}

export default {
  state, mutations, actions
}
