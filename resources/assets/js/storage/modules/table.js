import * as Types from './mutation-type'

const state =  {
  fieldExcept: [],
  createStatus:  false,
}


const mutations =  {
  [Types.SET_EXCEPT](state, payload) {
    state.fieldExcept = payload.item
  },
  [Types.SET_CREATE_STATUS](state) {
    state.createStatus = !state.createStatus
  }
}

const actions = {
  setExcept({commit, dispatch}, item) {
    commit({
      type: Types.SET_EXCEPT,
      item
    })
  },
  setCreateStatus({commit, dispatch}) {
    commit({
      type: Types.SET_CREATE_STATUS
    })
  },
}

export default {
  state, mutations, actions
}
