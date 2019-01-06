import api from "@/api";
import * as types from "../mutations-type";

function nowTime() {  
  var newDate=new Date();
  var year=newDate.getFullYear();
  var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
  var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
  var hours=newDate.getHours()<10?"0"+newDate.getHours():newDate.getHours();
  var minuts=newDate.getMinutes()<10?"0"+newDate.getMinutes():newDate.getMinutes();
  var seconds=newDate.getSeconds()<10?"0"+newDate.getSeconds():newDate.getSeconds();
  return year+"-"+month+"-"+day+" "+hours+":"+minuts+":"+seconds
 };

export default {
  state: {
    roleTableInfo:[],
    createCb: false,
    roleInfoById:{},
    updateCb:false
  },
  getters: {
    roleTableInfo: state => state.roleTableInfo,
    createCb: state => state.createCb,
    roleInfoById: state => state.roleInfoById,
    updateCb: state => state.updateCb
  },
  mutations: {
    [types.FETCH_ROLES](state, data) {
      state.roleTableInfo = data
    },
    [types.CREATE_ROLES](state, data) {
      state.createCb = data
    },
    [types.GET_ROLES_BY_ID](state, data) {
      state.roleInfoById = data
    },
    [types.UPDATEROLE_BY_ID](state, data) {
      state.updateCb = data
    }

    
  },
  actions: {
      //渲染角色Table
    async getRoleTable({ commit } ,params) {
      let { data } = await api.roles.getRoles({
        queryParams: params
      });
       commit(types.FETCH_ROLES, data);
    },

    //新建角色
    async createRole({ commit },param) {
      
      let { data } = await api.roles.createRoles({
        data: [param]
      });
      console.log(data)
       commit(types.CREATE_ROLES, data);  
    },

    //根据Id获取role信息
    async getRoleById({ commit },param) {
      // console.log(parseInt(param))
      let { data } = await api.roles.getRolesById({
        pathParams: {
          id: parseInt(param)
        }
       
      });
      // console.log(data)
    
     commit(types.GET_ROLES_BY_ID, data)
    },

    //更新角色信息
    async updateRoleById({ dispatch,commit },param) {
      
      let { data } = await api.roles.updateRolesById({
        pathParams: {
          id:param.id
        },
        data: {
          description: param.description,
          roleCode: param.roleCode,
          roleName: param.roleName,
        }
        
      });
      console.log(data)
      commit(types.UPDATEROLE_BY_ID, data)
     
    },

    async deleteRoleByid({ dispatch,commit },param) {
      let { data } = await api.roles.deleteRolesById({
        pathParams: {
          id:param
        }
      });
      console.log(data)
    
    },
  }
};
