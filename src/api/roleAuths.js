//角色授权接口模块
const roleAuths = [
    {name:'createRoleAuths',url:'/role-auths/{userAccountId}'},   //    将角色赋予用户
    {name:'getRoleAuths',url:'/role-auths/{userAccountId}/avariable-roles'}  //    获取用户授权与没授权的角色信息, granted = ture为已授权的role，否则为未授权的rol
]

export default roleAuths;