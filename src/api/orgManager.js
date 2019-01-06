//组织机构管理 Organization Controller
const orgManager = [
    {name:'getOrgList',url:'/orgs'}, //机构列表查询
    {name:'createNewOrg',url:'/orgs'}, //   创建组织机构
    {name:'getOrgById',url:'/orgs/{id}'}, //       根据ID查询指定组织机构
    {name:'updateOrgById',url:'/orgs/{id}'}, //       修改组织机构
    {name:'deleteOrgById',url:'/orgs/{id}'}, //       删除组织机构
    {name:'getOrgChildById',url:'/orgs/{id}/children'}, //       列出指定组织机构的子组织机构
    {name:'getOrgUnderEmployeeById',url:'/orgs/{id}/employees'}, //        列出指定组织机构下的直接员工
    {name:'createNewEmployee',url:'/orgs/{id}/employees'}, //           机构下创建员工
    {name:'getPositionById',url:'/orgs/{id}/posistions'}, //          列出指定组织机构下的岗位
    {name:'getChildNodes',url:'/orgs/child-nodes'}, //          
    {name:'getOrgListTree',url:'/orgs/children-org-and-position'}, //    
    {name:'getOrgRootTree',url:'/orgs/root'}, //          获取某一组织机构节点下一级的组织机构和岗位，如果不传parentId，则查询根节点信息
]

export default orgManager;
