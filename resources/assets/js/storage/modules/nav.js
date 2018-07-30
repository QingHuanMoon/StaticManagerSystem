import * as Types from './mutation-type'
const state = {
  navData: [
    {
      itemName: '用戶權限',
      routerName: '',
      hasChildren: true,
      childrenItem: [
        {
          itemName: '用戶管理',
          fatherName: '用戶權限',
          routerName: 'userTable',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        },
        {
          itemName: '角色管理',
          fatherName: '用戶權限',
          routerName: 'roleTable',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        },
        {
          itemName: '權限管理',
          fatherName: '用戶權限',
          routerName: 'permissionTable',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        },
        {
          itemName: '用戶角色管理',
          fatherName: '用戶權限',
          routerName: '',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        },
        {
          itemName: '角色權限管理',
          fatherName: '用戶權限',
          routerName: '',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        }
      ]

    },
    {
      itemName: '數據維護',
      routerName: '',
      hasChildren: true,
      childrenItem: [
        {
          itemName: '遊戲管理',
          fatherName: '數據維護',
          routerName: 'gameTable',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        },
        {
          itemName: '分類管理',
          fatherName: '數據維護',
          routerName: 'cateTable',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        },
        {
          itemName: '模板管理',
          fatherName: '數據維護',
          routerName: 'templateTable',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        },
      ]
    },
    {
      itemName: '編輯工作台',
      routerName: '',
      hasChildren: true,
      childrenItem: [
        {
          itemName: '編輯文章',
          fatherName: '編輯工作台',
          routerName: 'articleEdit',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        },
        {
          itemName: '發佈文章',
          fatherName: '編輯工作台',
          routerName: 'articlePublish',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        }
      ]
    },
    {
      itemName: '緩存系統',
      routerName: '',
      hasChildren: true,
      childrenItem: [
        {
          itemName: '緩存列表',
          fatherName: '緩存系統',
          routerName: '',
          hasChildren: false,
          isOpen: false,
          isActive: false,
        }
      ]
    }
  ],
  tagData: [],
  curFather: '',
  curChild: '',
  curRouter: '',
}

const mutations = {
  [Types.ADD_TAG](state, data) {
    if (!data.item.isOpen) {
      state.tagData.forEach((item) => {
        item.isActive = false;
      })
      data.item.isOpen = true;
      data.item.isActive = true;
      state.tagData.push(data.item)
      state.curFather = data.item.fatherName
      state.curChild = data.item.itemName
      state.curRouter = data.item.routerName
    }
  },
  [Types.REMOVE_TAG](state, data) {
    state.navData.forEach((cItem, cIndex) => {
      cItem.childrenItem.forEach((item, index) => {
        if(item.isActive === true) {
          state.navData[cIndex].childrenItem[index].isActive = false
          state.navData[cIndex].childrenItem[index].isOpen = false
          data.item.forEach((tagItem, tagIndex) => {
            if(tagItem.routerName === state.navData[cIndex].childrenItem[index].routerName) {
              data.item.splice(tagIndex, 1)
            }
          })
        }
      })
    })
    state.navData.forEach((cItem, cIndex) => {
      if( data.item.length >= 1) {
        cItem.childrenItem.forEach((item, index) => {
          if(item.routerName === data.item[data.item.length -1].routerName) {
            item.isActive = true
            state.curFather = item.fatherName
            state.curChild  = item.itemName
            state.curRouter = item.routerName
          }
        })
      } else {
        state.curFather = ''
        state.curChild  = ''
      }
    })
  },
  [Types.CHANGE_TAG](state, payload) {
    state.tagData.forEach((item) => {
      item.isActive = false;
      payload.item.isActive = true;
      state.curFather = payload.item.fatherName
      state.curChild = payload.item.itemName
    })
  }
}

const actions = {
  addTag({commit, dispatch}, item) {
    commit({
      type: Types.ADD_TAG,
      item
    })
  },
  removeTag({commit, dispatch}, item) {
    commit({
      type: Types.INIT_TOTAL
    })
    commit({
      type: Types.REMOVE_TAG,
      item
    })
  },
  changeTag({commit, dispatch}, item) {
    commit({
      type: Types.CHANGE_TAG,
      item
    })
  }
}


export default {
  state, mutations, actions
}
