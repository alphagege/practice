//员工管理
const employeeManager = [
    {name:'getEmployeesList',url:'/employees'}, //查询员工列表，分页；查询条件可选
    {name:'getEmployeeInfo',url:'/employees/{id}'}, //   获取员工信息
    {name:'updateEmployeeInfo',url:'/employees/{id}'}, //   修改员工信息
    {name:'deleteEmployeeInfo',url:'/employees/{id}'}, //    获取员工信息
    {name:'getAssEmployee',url:'/employees/un-associated-account'}, //     获取未关联员工的信息
]

export default employeeManager;
