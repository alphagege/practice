

const org = [
    {name:'getWorkGroupList',url:'/work-groups'},   //列出根节点工作组
    {name:'createWorkGroupList',url:'/work-groups'},  // 保存工作组
    {name:'getWorkGroupById',url:'/work-groups/{id}'},  // 根据工作组ID，获取工作组信息
    {name:'updateWorkGroupById',url:'/work-groups/{id}'},  // 更新工作组
    {name:'deleteWorkGroupById',url:'/work-groups/{id}'},  //     删除工作组
    {name:'getChildWorkGroupById',url:'/work-groups/{id}/children'},  // 列出指定工作组 ID 下的子工作组
    {name:'getEmployeesInWorkGroup',url:'/work-groups/{id}/employees'},  //     列出指定工作组下的所有员工
    {name:'createEmployeesInWorkGroup',url:'/work-groups/{id}/employees'},  //     工作组下创建员工
  
    {name:'getEmployeesAssociatedAccount',url:'/work-groups/{id}/un-associated-employees'},  // 获取未关联员工的信息
    {name:'deleteAssociatedEmployee',url:'/work-groups/{id}/employees'},  //     工作组下删除员工关联关系


]

export default org;