
import api from '@/api'
import * as types from '../mutations-type'

export default {
  state : {
   appList:[],
   appInfoById: {}
  },
  getters : {
    appList: state => state.appList,
    appInfoById: state => state.appInfoById,
    
  },
  mutations : {

    [types.GET_APP_LIST](state, data) {
      state.appList = data;
    },
    [types.GET_APPINFO_BY_ID](state, data) {
      state.appInfoById = data;
      // console.log(data)
    },
 
  },
  actions:{
    async fetchAppList({commit},params) {
      let {data} = await api.app.getAppList({
        queryParams:params
      });
      commit(types.GET_APP_LIST, data);
    },
    async getAppInfo({commit},params) {
      let {data} = await api.app.getAppInfoById({
        pathParams:{
          appId: params
        }
      });
     
      commit(types.GET_APPINFO_BY_ID, data);
    },
  }
}
  //http://${IP}:{$PORT}/${CONTEXT_PATH}/tarest/services/function-mappings