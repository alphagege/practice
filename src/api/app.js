//字典数据 Dict Controller
const app = [
    {name:'getAppList',url:'/apps'}, //        获取所有应用信息
    {name:'createApp',url:'/apps'}, //        添加应用信息
    {name:'getAppInfoById',url:'/apps/{appId}'}, //          获取应用信息
    {name:'updateAppById',url:'/apps/{appId}'}, //        更新应用信息
    {name:'deleteAppById',url:'/apps/{appId}'}, //       删除应用
]

export default app;
