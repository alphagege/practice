import api from '@/api'
import * as types from '../mutations-type'
import util from '@/utils/util'
export default {
    state : {
      me: {},
      userTable:[],
      userInfo:{},
      roleAuthData:{
          
      },
      createUserCb: false,
      updateUserCb: false,
      personInfo: {}
    },
    getters : {
      me: state => state.me,
      userTable: state => state.userTable,
      userInfo: state => state.userInfo,
      roleAuthData: state => state.roleAuthData,
      createUserCb: state => state.createUserCb,
      updateUserCb: state => state.updateUserCb,
      personInfo: state => state.personInfo
    },
    mutations : {
      setMe(state, me) {
        state.me = me;
      },
      [types.GET_PERSON_INFO](state, data) {
        state.personInfo = data;
        console.log(data)
      },
      [types.GET_USER_TABLE](state, data) {
          state.userTable = data
      },
      [types.GET_USER_BY_USERNAME](state, data) {
          state.userInfo = data
      },
      [types.GET_ROLEAUTHS_BY_USERNAME](state, data) {
          state.roleAuthData = data
      },
      [types.CREATE_USER_OK](state, data) {
        state.createUserCb = data
      },
      [types.UPDATE_USER](state, data) {
        state.updateUserCb = data
      },
    },
    actions : {
      async fetchMe({
        commit
      }) {
        let res = await api.user.getMe({
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        commit('setMe', res.data);
      },

      async fetchPersonInfo({
        commit
      }) {
        let res = await api.user.getPersonInfo();
        
        commit('GET_PERSON_INFO', res.data);
      },
      //渲染table
      async getUserTable( {commit},params) {
          
          let {data} = await api.user.getUserList({
              queryParams: params
          
          });
        
          commit(types.GET_USER_TABLE, data);
      },
      //创建新用户
      async createNewUser( {commit},params) {
          console.log(params)
          let {data} = await api.user.createUser({
              data: params,
          }); 
          commit(types.CREATE_USER_OK, data);
      },
      //根据username获取user信息
      async getUserInfoByUsername( { commit },params){
          // console.log(params)
          let {data} = await api.user.getUserMsg({
              pathParams: {
                  id:params  
              }
          }); 
          console.log(data)
          commit(types.GET_USER_BY_USERNAME, data);
      },
      //根据id更新user信息
      async updateUserById( { commit }, params){
          
          let {data} = await api.user.updateUserById({
              pathParams: {
                  id:params.id
              },
              data:{
                  accountExpiredDate: (typeof(params.accountExpiredDate)==="undefined")?'':util.getTimeString(params.accountExpiredDate, 'YYYY-MM-DD HH:mm:ss'),
                  email: params.email,
                  name: params.name,
                  passwordExpiredDate: (typeof(params.passwordExpiredDate)==="undefined")?'':util.getTimeString(params.passwordExpiredDate, 'YYYY-MM-DD HH:mm:ss'),
                  startValidDate: (typeof(params.startValidDate)==="undefined")?'':util.getTimeString(params.startValidDate, 'YYYY-MM-DD HH:mm:ss'),
                  status: params.status
              }
          }); 
          commit(types.UPDATE_USER, data);
      },

      //根据id删除user信息
      async deleteUserById( { commmit }, params) {
          console.log(params)
          let {data} = await api.user.deleteUserById({
              pathParams: {
                  id:params
              },
          }); 
      },
      //密码重置
      async resetPsdById( { commmit }, params) {
          let {data} = await api.user.updateUserPswById({
              pathParams: {
                  id:params
              },
              data: {
                  "confirmPassword": "000000",
                  "password": "000000"
                }  
          }); 
      },
      //获取用户角色信息
      async getRoleAuthsByName( { commit }, params) {
          console.log(params)
          let {data} = await api.roleAuths.getRoleAuths({
              pathParams: {
                  userAccountId: params
              },
          }); 
          // console.log(data)
          var  roleAuthData={
              TransferData:[],
              targetKeys:[]
          }
          data.map(item => {
              let obj = {};
              obj.key = item.id;
              obj.label = item.roleName;
              obj.disabled = false;
              roleAuthData.TransferData.push(obj);
              if(item.granted==true) {
                  roleAuthData.targetKeys.push(obj.key)
              }
          });
          console.log(roleAuthData)
          commit(types.GET_ROLEAUTHS_BY_USERNAME, roleAuthData);
      },
          
      //给用户分配角色
      async assignRoleAuths( {commit} ,params) {
          
          for(var i=0;i<params[0].length;i++){
              params[0][i] = parseInt(params[0][i])
            }
            console.log(params[0])
            console.log(parseInt(params[1]))
          let {data} = await api.roleAuths.createRoleAuths({
          
              pathParams: {
                  userAccountId: parseInt(params[1])
              },
              data: {
                  roleIds: params[0],
                  roleScope: '',
                  userAccountId: parseInt(params[1])
              }
          }); 
          // console.log(data)
      }

    }
}

function formatTime(newDate) {  
    var year=newDate.getFullYear();
    var month=(newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):newDate.getMonth()+1;
    var day=newDate.getDate()<10?"0"+newDate.getDate():newDate.getDate();
    var hours=newDate.getHours()<10?"0"+newDate.getHours():newDate.getHours();
    var minuts=newDate.getMinutes()<10?"0"+newDate.getMinutes():newDate.getMinutes();
    var seconds=newDate.getSeconds()<10?"0"+newDate.getSeconds():newDate.getSeconds();
    return year+"-"+month+"-"+day+" "+hours+":"+minuts+":"+seconds
};