import * as Types from './mutation-type'

const state = {
  articleInfo: {},
  game_name: '',
  cate_name: '',
  editComplete: false,
  editCancel: false,
  isShow: false,
  status: [
    {
      label: '未发布',
      key: 0,
    },
    {
      label: '已发布',
      key: 1
    }
  ]
}

const mutations = {
  [Types.SET_STORE_INFO](state, payload) {
    state.articleInfo = payload.item.data
    state.game_name = payload.item.gameName
    state.cate_name = payload.item.cateName
  },
  [Types.SET_EDIT_COMPLETE](state) {
    state.editComplete = true
  },
  [Types.CANCEL_EDIT_DATA](state) {
    state.editCancel = true
  },
  [Types.SET_IS_SHOW](state) {
    state.isShow = true
  },
  [Types.RESET_EDIT_COMPLETE](state) {
    state.editComplete = false
  }
}



const actions = {
  setStoreInfo({commit, dispatch}, item) {
    commit({
      type: Types.SET_STORE_INFO,
      item
    })
  },
  setEditComplete({commit, dispatch}) {
    commit({
      type: Types.SET_EDIT_COMPLETE
    })
  },
  resetEditComplete({commit, dispatch}) {
    commit({
      type: Types.RESET_EDIT_COMPLETE
    })
  },
  cancelEditData({commit, dispatch}) {
    commit({
      type: Types.CANCEL_EDIT_DATA
    })
  },
  setIsShow({commit, dispatch}) {
    commit({
      type: Types.SET_IS_SHOW
    })
  }
}

export default {
  state, mutations, actions
}
