//字典类型 Dict Type Controller
const dictType = [
    {name:'getDictType',url:'/dict-types'}, //     根据dictTypeCode和dictTypeName模糊查询，获取字典类型
    {name:'createDictType',url:'/dict-types'}, //    创建字典类型
    {name:'getDictTypeById',url:'/dict-types/{id}'}, //    获取字典类型
    {name:'updateDictTypeById',url:'/dict-types/{id}'}, //    更新字典类型
    {name:'deleteDictTypeByIds',url:'/dict-types/{ids}'}, //   批量删除字典类型
    {name:'getChildDictData',url:'/dicts/children'}, //    获取字典类型子项

    {name:'getUnderDictByCode',url:'/dict-types/{dictTypeCode}/dicts'}, //   根据dictTypeCode获取dictType下面的字典
    
    {name: 'getDictTypesChildren', url: '/dict-types/{dictTypeCode}/children'}
    // {name:'getDictTypeByCode',url:'/dict-types/types'}, //       根据dictTypeCode和dictTypeName模糊查询，获取字典类型
]

export default dictType;
