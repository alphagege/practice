// 角色管理table数据
export const roleColumns = [
    {
        title: '角色名称',
        key: 'name',
        editable: true
    },
    {
        title: '角色代码',
        key: 'code',
        editable: true
    },
    {
        title: '创建时间',
        key: 'createTime'
    },
    {
        title: '角色描述',
        key: 'roleDes',
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 200,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];

export const roleData = [
    {
        name: 'mascoter',
        code: 'abcd',
        createTime: '前端开发',
        roleDes: 'coframe_________________________2222222222222222222222222222222222222222_____________'
    },
    {
        name: 'henry',
        code: 'h',
        createTime: '前端开发',
        roleDes: 'coframe______________________________________'
    },
    {
        name: 'fellow',
        code: 'c',
        createTime: '前端开发',
        roleDes: 'coframe______________________________________'
    },
    {
        name: 'fellow',
        code: 'd',
        createTime: '前端开发',
        roleDes: 'coframe______________________________________'
    },
    {
        name: 'fellow',
        code: 'e',
        createTime: '前端开发',
        roleDes: 'coframe______________________________________'
    }
];



// 用户管理table数据
export const userColumns = [
    {
        title: '用户账号',
        key: 'account',
        editable: true
    },
    {
        title: '用户名称',
        key: 'name',
        editable: true
    },
    {
        title: '用户状态',
        key: 'status',
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 200,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];

export const userData = [
    {
        account: 'msct1',
        name: '范迪塞尔2',
        status: '充满活力222222222222222222222222222222222222222222222222222222222222',
    },
    {
        account: 'msct12',
        name: '范迪塞尔111',
        status: '充满活力',
    },
    {
        account: 'msct111',
        name: '范迪塞尔111',
        status: '充满活力',
    }
];

// 权限管理角色列表table数据
export const authColumns = [
    {
        title: '角色名称',
        key: 'name',
        editable: true
    },
    {
        title: '角色代码',
        key: 'code',
        editable: true
    },
    {
        title: '创建时间',
        key: 'time',

    },
    {
        title: '角色描述',
        key: 'des',
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 200,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];

export const authData = [
    {
        name: 'msct1',
        code: '范迪塞尔2',
        time: '1988-7-5',
        des:'22222222222'
    },
    {
        name: 'msct1',
        code: '范迪塞尔2',
        time: '1988-7-5',
        des:'2222222222'
    },
    {
        name: 'msct1',
        code: '范迪塞尔2',
        time: '1988-7-5',
        des:'22222222'
    }
];

// 业务字典数据
/////// 字典类型数据
export const dic1Columns = [
    {
        title: '类型代码',
        key: 'code',
        editable: true
    },
    {
        title: '类型名称',
        key: 'name',
        editable: true
    },
    {
        title: '操作',
        align: 'center',
        width: 200,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];

export const dic1Data = [
    {
        code: 'msct111111',
        name: '范迪塞尔2',
    },
    {
        code: 'msct22222',
        name: '范迪塞尔2',
    },
    {
        code: 'msct22222',
        name: '范迪塞尔2',
    },
    {
        code: 'msct22222',
        name: '范迪塞尔2',
    },
];

export const dic2Columns = [
    {
        title: '字典项代码',
        key: 'code',
        editable: true
    },
    {
        title: '字典项名称',
        key: 'name',
        editable: true
    },
    {
        title: '排序',
        key: 'sort',
        sortable: true,
        width: 100,
    },
    {
        title: '操作',
        align: 'center',
        width: 200,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];

export const dic2Data = [
    {
        code: 'msct111111',
        name: '范迪塞尔2',
        sort: 5
    },
    {
        code: 'msct22222',
        name: '范迪塞尔2',
        sort: 4
    },
    {
        code: 'msct22222',
        name: '范迪塞尔2',
        sort: 3
    },
    {
        code: 'msct22222',
        name: '范迪塞尔2',
        sort: 2
    },
];

/////// 机构查询数据
export const govColumn = [
    {
        title: '机构名称',
        key: 'name',
        editable: true
    },
    {
        title: '机构代码',
        key: 'code',
        editable: true
    },
    {
        title: '上级机构代码',
        key: 'parentCode',
    },
    {
        title: '机构等级',
        key: 'govLever',
    },
    {
        title: '机构类型',
        key: 'govType',
    },
    {
        title: '机构状态',
        key: 'govStatus',
    },
    {
        title: '创建时间',
        key: 'createTime',
    }
];

export const govData = [
    {
        name: 'msct111111',
        code: 'org___1',
        parentCode: 'org___1',
        govLever: '范迪塞尔2',
        govType: '范迪塞尔2',
        govStatus: '范迪塞尔2',
        createTime: '范迪塞尔2',
    }, {
        name: 'msct111111',
        code: 'org___1',
        parentCode: 'org___1',
        govLever: '范迪塞尔2',
        govType: '范迪塞尔2',
        govStatus: '范迪塞尔2',
        createTime: '范迪塞尔2',
    }, {
        name: 'msct111111',
        code: 'org___1',
        parentCode: 'org___1',
        govLever: '范迪塞尔2',
        govType: '范迪塞尔2',
        govStatus: '范迪塞尔2',
        createTime: '范迪塞尔2',
    },
 
];

const tableData = {
    roleColumns: roleColumns,
    roleData:roleData,
    userColumns: userColumns,
    userData: userData, 
    authColumns: authColumns,
    authData: authData,
    dic1Columns: dic1Columns,
    dic1Data: dic1Data,
    dic2Columns: dic2Columns,
    dic2Data: dic2Data,
    govColumn,
    govData


   
};

export default tableData;
