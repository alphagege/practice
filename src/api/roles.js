
//角色接口模块 Role Controller
const roles = [
    {name:'getRoles',url:'/roles'},   //    获取角色信息
    {name:'createRoles',url:'/roles'},  //   添加角色信息
    {name:'getRolesById',url:'/roles/{id}'},  //     根据id获取角色信息
    {name:'updateRolesById',url:'/roles/{id}'},  //     根据id更新角色信息
    {name:'deleteRolesById',url:'/roles/{id}'},  //     根据id删除角色信息
  
]

export default roles;