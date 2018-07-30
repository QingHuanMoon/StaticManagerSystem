const state = {
  // 用戶表
  UserTable: {
    C: '/v1/user/store',
    U: '/v1/user/update',
    R: '/v1/user/users',
    D: '/v1/user/destroy'
  },
  // 角色表
  RoleTable: {
    C: '/v1/role/store',
    U: '/v1/role/update',
    R: '/v1/role/roles',
    D: '/v1/role/destroy'
  },
  // 權限表
  PermissionTable: {
    C: '/v1/permission/store',
    U: '/v1/permission/update',
    R: '/v1/permission/permissions',
    D: '/v1/permission/destroy'
  },
  // 遊戲表
  GameTable: {
    C: '/v1/game/store',
    U: '/v1/game/update',
    R: '/v1/game/games',
    D: '/v1/game/destroy'
  },
  // 分類表
  CateTable: {
    C: '/v1/cate/store',
    U: '/v1/cate/update',
    R: '/v1/cate/cates',
    D: '/v1/cate/destroy'
  },
  TemplateTable: {
    C: '/v1/template/store',
    U: '/v1/template/update',
    R: '/v1/template/templates',
    D: '/v1/template/destroy'
  }
}

export default {
  state,
}
