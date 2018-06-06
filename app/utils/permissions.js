const permission = {
    // 用户管理
    user_add: {
        code: '10001',
        is: false
    },
    user_del: {
        code: '10002',
        is: false
    },
    user_edit: {
        code: '10003',
        is: false
    },

    // 角色管理
    role_add: {
        code: '20001',
        is: false
    },
    role_del: {
        code: '20002',
        is: false
    },
    role_edit: {
        code: '20003',
        is: false
    },

    // 机构管理
    org_add: {
        code: '30001',
        is: false
    },
    org_del: {
        code: '30002',
        is: false
    },
    org_edit: {
        code: '30003',
        is: false
    },

    // 数据源管理
    source_list_add: {
        code: '40011',
        is: false
    },
    source_list_del: {
        code: '40012',
        is: false
    },
    source_list_edit: {
        code: '40013',
        is: false
    },

    // 数据源类型管理
    source_type_add: {
        code: '40021',
        is: false
    },
    source_type_del: {
        code: '40022',
        is: false
    },
    source_type_edit: {
        code: '40023',
        is: false
    },

    // // 接口组管理
    // source_manage_add: {
    //     code: '40031',
    //     is: false
    // },
    // source_manage_del: {
    //     code: '40032',
    //     is: false
    // },
    // source_manage_edit: {
    //     code: '40033',
    //     is: false
    // },

    // 接口组管理
    source_manage_add: {
        code: '60061',
        is: false
    },
    source_manage_del: {
        code: '60062',
        is: false
    },
    source_manage_edit: {
        code: '60063',
        is: false
    },

    // 接口管理
    my_api: {
        code: '60010',
        is: false,
    },
    my_api_use: {//我使用的接口
        code: '60011',
        is: false
    },
    my_api_push: {//我发布的接口
        code: '60012',
        is: false
    },

    //数据接口管理
    data_api_add: {
        code: '60022',
        is: false
    },
    data_api_del: {
        code: '60023',
        is: false
    },
    data_api_start: {
        code: '60024',
        is: false
    },
    data_api_stop: {
        code: '60025',
        is: false
    },
    data_api_apply: {
        code: '60026',
        is: false
    },

    //接口发布审批
    push_api_approval: {
        code: '60032',
        is: false
    },
    push_api_del: {
        code: '60034',
        is: false
    },

    //接口使用审批
    use_api_approval: {
        code: '60042',
        is: false
    },
    use_api_del: {
        code: '60043',
        is: false
    },
}

const menu = [
    {
        id: '201',
        icon: 'home',
        name: '首页',
        route: '/',
        visit: true,
    },
    {
        id: '202',
        name: '个人中心',
        mpid: '-1',
        route: '/my',
        visit: true,
    },
    {
        id: '70000',
        name: '接口监控',
        icon: 'desktop',
    }, {
        id: '70010',
        bpid: '70000',
        mpid: '70000',
        name: '服务访问情况',
        route: '/monitor/situation',
    }, {
        id: '70020',
        bpid: '70000',
        mpid: '70000',
        name: '服务调用审计',
        route: '/monitor/audit',
    },
    {
        id: '10000',
        name: '用户管理',
        icon: 'user',
        route: '/user',
    },
    {
        id: '20000',
        name: '角色管理',
        icon: 'usergroup-add',
        route: '/role',
    },
    {
        id: '30000',
        name: '机构管理',
        icon: 'environment-o',
        route: '/org',
    },
    {
        id: '60000',
        name: '接口管理',
        icon: 'fork',
    },
    {
        id: '60010',
        name: '我的接口',
        bpid: '60000',
        mpid: '60000',
        route: '/myApi/list',
    },
    {
        id: '60020',
        name: '数据接口管理',
        bpid: '60000',
        mpid: '60000',
        route: '/dataApi/list',
    },
    {
        id: '60060',
        mpid: '60000',
        bpid: '60000',
        name: '接口组管理',
        route: '/dataApi/manage',
    },
    {
        id: '60030',
        name: '接口发布审批',
        bpid: '60000',
        mpid: '60000',
        route: '/pushCheck/list',
    }, {
        id: '60040',
        name: '接口使用审批',
        bpid: '60000',
        mpid: '60000',
        route: '/useCheck/list',
    },
    {
        id: '60050',
        name: '接口详情',
        bpid: '',
        mpid: '-1',
        route: '/api/detail/:id',
        visit: true,
    },
    {
        id: '40000',
        name: '数据源',
        icon: 'database',
    }, {
        id: '40010',
        mpid: '40000',
        bpid: '40000',
        name: '数据源管理',
        route: '/source/list',
    }, {
        id: '40020',
        mpid: '40000',
        bpid: '40000',
        name: '数据源类型',
        route: '/source/type',
    },
    // {
    //     id: '40030',
    //     mpid: '40000',
    //     bpid: '40000',
    //     name: '接口组管理',
    //     route: '/source/manage',
    // },
]

module.exports = {
    menu,
    permission,
}