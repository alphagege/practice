import api from '@/api'
import * as types from '../mutations-type'

export default {
    state : {
        groupListTree: [],
        groupInfoById: {},
        employeeListById: [],
        assAccountList: [],
        orgListTree: [],
        orgInfoById: {},
        positionInfoById: {},
        employeeListUnderOrg: [],
        employeeListUnderPosition: [],
        orgList: [],
        employeeInfoList:[],
        employeeAssList: []
    },
    getters : {
        groupListTree: state => state.groupListTree,
        groupInfoById: state => state.groupInfoById,
        employeeListById: state => state.employeeListById,
        assAccountList: state => state.assAccountList,
        orgListTree: state => state.orgListTree,
        orgInfoById: state => state.orgInfoById,
        positionInfoById: state => state.positionInfoById,
        employeeListUnderOrg: state => state.employeeListUnderOrg,
        employeeListUnderPosition: state => state.employeeListUnderPosition,
        orgList: state => state.orgList,
        employeeInfoList: state => state.employeeInfoList,
        employeeAssList: state => state.employeeAssList
    },
    mutations : {
        [types.GET_WORKGROUP_LIST](state, data) {
            state.groupListTree = data
        },
        [types.GET_WORKGROUP_INFO_BY_ID](state, data) {
            state.groupInfoById = data
            // console.log(data)
        },
        [types.GET_EMPLOYEES_INFO_BY_ID](state, data) {
            state.employeeListById = data
            console.log(data)
            
        },
        [types.GET_ASSOCIATED_ACCOUNT](state, data) {
            state.assAccountList = data
        },
        [types.GET_ORG_TREE](state, data) {
            state.orgListTree = data
        },
        [types.GET_ORGINFO_BY_ID](state, data) {
            state.orgInfoById = data
            // console.log(data)
        },
        [types.GET_POSITIONINFO_BY_ID](state, data) {
            state.positionInfoById = data
        },
        [types.GET_EMPLOYEE_UNDER_ORG](state, data) {
            state.employeeListUnderOrg = data
          
        },
        [types.GET_EMPLOYEE_UNDER_POSITION](state, data) {
            state.employeeListUnderPosition = data
            
        },
        [types.GET_ORG_LIST](state, data) {
            state.orgList = data
            // console.log(state.orgList)
        },
        [types.GET_EMPLOYEE_LIST](state, data) {
            state.employeeInfoList = data
            // console.log(state.orgList)
        },
        [types.GET_EMPLOYEE_ASS_LIST](state, data) {
            state.employeeAssList = data
            console.log(data)
        },
        
    },
    actions : {
        async getWorkGroupTree( {commit} ) {
            let {data} = await api.org.getWorkGroupList();
            var groupList = [];
            if(data){
                data.map(item => {
                let obj = {};
                obj.title = item.name;
                if(!item.leaf) obj.loading = false;
                obj.id = item.id;
                obj.children = [];
                groupList.push(obj);
            })
            };
            // console.log(groupList)
            commit(types.GET_WORKGROUP_LIST,groupList)
        },

        async getWorkGroupInfo( {commit}, params ) {

           let {data} = await api.org.getWorkGroupById({
               pathParams: {
                   id: params.id
               }
           });
        //    data.parentName = params.title
        //    data.sortNo =  data.sortNo.toString()
           
           commit(types.GET_WORKGROUP_INFO_BY_ID,data)
           
        },

        async updateGroupInfo( {commit}, params) {
         
            let {data} = await api.org.updateWorkGroupById({
                pathParams: {
                    id: params.id
                },
                data: {                    
                    code:params.code,
                    name: params.name,
                    parentId: params.parentId,
                    remark: params.remark,
                    sortNo: params.sortNo,
                    status: params.status,
                    type: params.type
                }
            });
        },

        async createNewWorkGroup( {commit} ,params) {
            // console.log(params)
            let {data} = await api.org.createWorkGroupList({
                data: params
            });
        },

        async getEmployeesListById ( {commit}, params){
   
            let {data} = await api.org.getEmployeesInWorkGroup({
                pathParams: {
                    id: parseInt(params.id)
                },
                queryParams: {
                    employeeName:params.employeeName,
                    employeeCode:params.employeeCode,
                    page: params.page,
                    size: params.pageSize,
                    sort: params.sort
                }
            });

            var employeesList = [];
            if(!data) {
                employeesList = []
            }else{
                data.content.map(item => {
                    let obj = {};
                   
                    obj.name = item.name;
                    obj.code = item.code;
                  
                    obj.status = item.status;
                   obj.id = item.id;
                    obj.email = item.oEmail;
                  
                    employeesList.push(obj);
                    employeesList.id = item.id;
                });
               
                employeesList.totalElements = parseInt(data.totalElements)
                employeesList.totalPages = parseInt(data.totalPages);
               
            }
           
            commit(types.GET_EMPLOYEES_INFO_BY_ID,employeesList)
        },

        async getAssEmployeeAccount ( {commit} ) {
            let {data} = await api.employeeManager.getAssEmployee();
            var list = data.map(item => {
                return {
                    value: item.id,
                    label: item.username
                };
            });
            commit(types.GET_ASSOCIATED_ACCOUNT,list)
        },

        async getOrgTree( {commit}, params) {
            let {data} = await api.orgManager.getOrgListTree({
                queryParams: {
                    parentId: params
                }
            });
         
            var orgList = [];
            if(data) {
                data.map(item => {
                    let obj = {};
                    obj.title = item.name;
                    if (!item.leaf&&item.ogType=="organization") obj.loading = false;
                    obj.id = item.id;
                    obj.children = [];
                    obj.parentId = item.parentId;
                    obj.orgtype = item.ogType;
                    orgList.push(obj);
                    // orgList.type = 'organization'
                });
            }
            
           
            commit(types.GET_ORG_TREE,orgList)
        },

        async getOrgInfoById( {commit}, params) {
            let {data} = await api.orgManager.getOrgById({
                pathParams: {
                    id: params
                }
            });
         
            // data.mark = 'org'
            commit(types.GET_ORGINFO_BY_ID,data)
        },
        
        async getPositionInfoById ( {commit} ,params) {
            let {data} = await api.positionManager.getPositionById({
                pathParams: {
                    id: params
                }
            });
           
            // data.mark = 'position'
            commit(types.GET_POSITIONINFO_BY_ID,data)
        },

        async getEmployeeUnderOrgList ({commit}, params) {
           
            let {data} = await api.orgManager.getOrgUnderEmployeeById({
                pathParams: {
                    id: params.id
                },
                queryParams: {
                    employeeName: params.searchConName,
                    employeeCode: params.searchConCode,
                    page:0,
                    size: params.pageSize,
                    sort: ''
                }
            });
            console.log(data)
            
            commit(types.GET_EMPLOYEE_UNDER_ORG,data)
        },

        async getEmployeeUnderPostionList ({commit}, params) {
            
            let {data} = await api.positionManager.getEmployeeUnderPostion({
                pathParams: {
                    id: params.id
                },
                queryParams: {
                    employeeName: params.employeeName,
                    employeeCode: params.employeeCode,
                    page:params.page,
                    size: params.pageSize,
                    sort: ''
                }
            });
           
            
            commit(types.GET_EMPLOYEE_UNDER_POSITION,data)
        },

        async getOrgListQuery({commit}, params) {
            let {data} = await api.orgManager.getOrgList(
                {
                queryParams:params
                 }       
            )
            // console.log(data)
          commit(types.GET_ORG_LIST,data)
        },

        async getEmployeeListQuery({commit}, params) {
            console.log(params)
            let {data} = await api.employeeManager.getEmployeesList(
                {
                queryParams:params
                 }       
            )
           
        },
        async getUnAssEmployeeList({commit},params) {
            console.log(params)
            let {data} = await api.org.getEmployeesAssociatedAccount(
                {
                    pathParams:{id:params.id},
                    queryParams:{
                        employeeName:params.employeeName,
                        employeeCode:params.employeeCode,
                        page:params.page,
                        size:params.size,
                        sort:params.sort
                    }  
                }
            )
            console.log(data)
            commit(types.GET_EMPLOYEE_LIST,data)
        },
        async getEmployeeAssList({commit}, params) {
            
            let {data} = await api.positionManager.getAssEmployees(
                {
                    pathParams:{id:params.id},
                    queryParams:{
                        page:params.page,
                        size:params.size,
                        sort:params.sort
                    }
             }       
            )
           
            commit(types.GET_EMPLOYEE_ASS_LIST,data)

        }
    }
}
