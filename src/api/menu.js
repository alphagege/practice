//菜单接口模块 Menu Controller
const menus = [
    {name:'getMenus',url:'/menus'}, //获取所有一级菜单信息
    {name:'createMenu',url:'/menus'}, //添加菜单信息
    {name:'getMenuById',url:'/menus/{menuId}'}, //根据menuId获取菜单信息
    {name:'updateMenu',url:'/menus/{menuId}'}, //更新菜单信息
    {name:'deleteMenu',url:'/menus/{menuId}'}, //删除菜单信息
    {name:'getChildMenus',url:'/menus/{menuId}/children'}, //获取子节点菜单信息

    {name:'setMenuAuths',url:'/menu-auths', method: 'POST'},   //保存角色菜单信息
    {name:'getMenusByRole',url:'/menu-auths/{roleId}/granted-menus'},  // 根据角色获取菜单信息
    {name: 'getAvailableMenusByRoleId', url: '/menu-auths/{roleId}/available-menus'},

    // 服务功能授权接口
    {name:'setServiceAuths',url:'/functions', method: 'POST'},   //    服务功能授权
    {name:'getServiceByRole',url:'/functions/{roleId}/granted-functions'},  //     根据角色获取菜单信息
    {name:'getService',url:'/functions/available-functions'},  //         获取所有服务功能信息，返回功能树，已授权granted=true，未授权granted=false
    // {name: 'getAvailableMenusByRoleId', url: '/menu-auths/{roleId}/available-menus'}
]

export default menus;
