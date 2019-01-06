import api from "@/api";
import * as types from "../mutations-type";

export default {
  state: {
    dictTypeList: [],
    dictTypeById: {},
    dictUnderTypeList: [],
    dictInfoById: {},
    dictTypeDeleteCb:[]
  },
  getters: {
    dictTypeList: state => state.dictTypeList,
    dictTypeById: state => state.dictTypeById,
    dictUnderTypeList: state => state.dictUnderTypeList,
    dictInfoById: state => state.dictInfoById,
    dictTypeDeleteCb: state => state.dictTypeDeleteCb,
  },
  mutations: {
    [types.GET_DICTTYPE_TABLE](state, data) {
      state.dictTypeList = data
    },
    [types.GET_DICTTYPE_BY_ID](state, data) {
      state.dictTypeById = data
    },
    [types.GET_UNDER_DICTTYPE](state, data) {
      state.dictUnderTypeList = data;
      console.log(data)
    },
    [types.GET_DICT_BY_ID](state, data) {
      state.dictInfoById = data
      // console.log(state.dictInfoById)
    },
    [types.DELETE_DICTTYPE_BY_IDS](state, data) {
      state.dictTypeDeleteCb = data
    }
  },
  actions: {
    async getDictTypeList( { commit }, params) {
      
      let { data } = await api.dictType.getDictType({
        queryParams: params
      });
     commit(types.GET_DICTTYPE_TABLE ,data)
    },

    async getChildDictType( {commit} ,params) {

    },

    async getDictTypeInfoById( { commit }, params) {
      let {data} = await api.dictType.getDictTypeById({
        pathParams:{
          id: params
        }
      });
  
      commit(types.GET_DICTTYPE_BY_ID, data)
    },


    async deleteDictTypeById ( { commit }, params) {
      console.log(params)
      let deleteParams = (typeof(params) ==='number') ? params:params.join(',');
      console.log(deleteParams);     
       let{data} = await api.dictType.deleteDictTypeByIds({
        pathParams:{
          ids: deleteParams
        }
      })
      commit(types.DELETE_DICTTYPE_BY_IDS, data)
    },

    async getUnderDictType ( { commit }, params) {
      // console.log(params)
      let{data} = await api.dictType.getUnderDictByCode({
        pathParams:{
          dictTypeCode: params.dictTypeCode,
        },
        queryParams:{
          page: params.page,
          size: params.size,
          sort: params.sort
        }
      });
      var dataParams = {}
      if(data){
        dataParams = data;
        dataParams.dictTypeCode = params.dictTypeCode
      }else{
       dataParams.dictTypeCode = params.dictTypeCode
        
      }
      commit(types.GET_UNDER_DICTTYPE, dataParams)
    },

    async createDictData( {commit} ,params) {
      let{data} = await api.dictCtr.createDict({
        data: {
          dictCode: params.newDictDataCode,
          dictName: params.newDictDataName,
          dictTypeCode: params.dictTypeCode,
          parentCode: params.newDictDataParentCode,
          sortNo: params.newDictDataSort
        }
      });
    },
    async getDictInfoById( {commit} ,params) {
      let{data} = await api.dictCtr.getDictById({
       pathParams:{
         id: params
       }
      });
      commit(types.GET_DICT_BY_ID, data)
    },

    async updateDictInfoById( {commit} ,params) {
      // console.log(params)
      let{data} = await api.dictCtr.updateDictById({
       pathParams:{
         id: params.id
       },
       data: {
        dictCode: params.dictCode,
        dictName:params.dictName,
        dictTypeCode:params.dictTypeCode,
        parentCode:params.parentCode,
        sortNo:params.sortNo
       }
      });
    },

    async deleteDictInfoById ( { commit }, params) {
      let deleteParams = (typeof(params) ==='string') ? params:params.join(',');  
       let{data} = await api.dictCtr.deleteDict({
        pathParams:{
          ids: deleteParams
        }
      })
    },


  }
}

