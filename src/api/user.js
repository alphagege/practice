const user = [
    {name: 'getPersonInfo', url: '/user-profile'},   // 根据账号ID查询
    {name: 'updatePersonInfo', url: '/user-profile'}, //    更新个人设置
    {name: 'updatePersonPsd', url: '/user-profile/password'}, //    修改密码
    {name: 'getMe', url: '/user/me'},
    // User manage
    {name: 'getUserList', url: '/user-accounts'},
    {name: 'createUser', url: '/user-accounts'},
    {name: 'updateUserById', url: '/user-accounts/{id}'},
    {name: 'deleteUserById', url: '/user-accounts/{id}'},
    {name: 'updateUserPswById', url: '/user-accounts/{id}/password'},
    {name: 'getUserByName',url:'/user-accounts/{id}'},
    {name: 'getGrantMenus', url: '/user-accounts/{id}/granted-menus'},
    {name: 'getUserMsg', url: '/user-accounts/{id}'},
  
    // Role auth controller
    // 获取用户授权与没授权的角色信息, granted = ture为已授权的role，否则为未授权的rol
    {name: 'getRoleMsg', url: '/role-auths/{id}/avariable-roles'},
    {name: 'getRoleGrantedMsg', url: '/role-auths/{id}/granted-roles'},
    {name: 'creatRoleAuth', url: '/role-auths/{id}'},

    {name: 'getSyncdataLatest', url: '/sync-data/records/latest'}, //    获取最新一条同步记录
    {name: 'createSyncdata', url: '/sync-data'}, //        同步数据

  ];
  
  export default user;