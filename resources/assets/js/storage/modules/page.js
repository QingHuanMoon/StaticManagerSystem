import * as Types from './mutation-type'

const state = {
  total: -1,
  size: '',
  isComplete: false,
  curPage: 1,

}

const mutations = {
  [Types.SET_TOTAL](state, payload) {
    state.total = payload.item
    state.isComplete = true
    setTimeout(() => {
      $('.card-box').css({
        "overflow-y": "auto"
      });
    }, 300)
  },
  [Types.CHANGE_PAGE](state, payload) {
    state.isComplete = false
    state.curPage = payload.item
  },
  [Types.INIT_COMPLETE](state) {
    state.isComplete = false
  },
  [Types.INIT_TOTAL](state) {
    state.total = -1;
  }

}

const actions = {
  setTotal({commit, dispatch}, item) {
    commit({
      type: Types.SET_TOTAL,
      item
    })
  },
  changePage({commit, dispatch}, item) {
    commit({
      type: Types.CHANGE_PAGE,
      item
    })
  },
  initComplete({commit}) {
    commit({
      type: Types.INIT_COMPLETE
    })
  },
  initTotal({commit}) {
    commit({
      type: Types.INIT_TOTAL
    })
  }
}

export default {
  state, mutations, actions
}