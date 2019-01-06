//岗位管理
const positionManager = [
    {name:'createNewPosition',url:'/positions'}, //    新增一条岗位记录
    {name:'getPositionById',url:'/positions/{id}'}, //       根据ID获取岗位信息
    {name:'updatePositionById',url:'/positions/{id}'}, //       更新岗位信息
    {name:'deletePositionById',url:'/positions/{id}'}, //       删除岗位
    {name:'getEmployeeUnderPostion',url:'/positions/{id}/employees'}, //           列出指定岗位下的直接员工
    {name:'createEmployeeUnderPostion',url:'/positions/{id}/employees'}, //           岗位下新增员工

    {name:'createAssEmployees',url:'/positions/{id}/employees'}, //               岗位下关联员工
    {name:'deleteAssEmployees',url:'/positions/{id}/employees'}, //                   岗位下删除员工关联关系
    {name:'getAssEmployees',url:'/positions/{id}/un-associated-employees'}, //                   列出指定岗位可关联的员工
   
]

export default positionManager;