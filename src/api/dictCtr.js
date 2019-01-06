//字典数据 Dict Controller
const dictCtr = [
    {name:'getDictByCode',url:'/dicts'}, //        根据类型code和dictCode查询数据字典
    {name:'createDict',url:'/dicts'}, //        添加字典数据
    // {name:'getDictUnderType',url:'/dicts/{dictTypeCode}/types}'}, //        获取dictType下面的字典
    {name:'getDictById',url:'/dicts/{id}'}, //        获取字典数据
    {name:'updateDictById',url:'/dicts/{id}'}, //       更新字典数据
    {name:'deleteDict',url:'/dicts/{ids}'},  //删除字典数据
    {name:'getChildDict',url:'/dicts/children'},  //            获取字典下的子项
    {name:'getDictExport',url:'/dicts/export'}, //           导出字典
    {name:'createDictImport',url:'/dicts/import'}, //           导出字典
]

export default dictCtr;
