const Mock = require('mockjs')

let postId = 0

const mockFn = (data = null, code = 200, message = "请求成功") => {
    return Mock.mock({data, code, message})
}

module.exports = {
    /*成功通用*/
    sucCommon: mockFn(),

    /*失败通用*/
    errCommon: mockFn(null, 201, "请求失败"),

    /*登录*/
    getToken: (function () {
        return Mock.mock({
            access_token: "0819bdae-247a-424f-a020-5743750b9651",
            expires_in: 2591017,
            refresh_token: "dbfef474-0f3e-4612-9e25-e2512129dbf4",
            scope: "read write trust",
            token_type: "bearer"
        })
    })(),

    userInfo: mockFn({
        userName: 'admin',
        companyName: '车站大脑',
        role: 'admin'
    }),

    /*权限管理*/
    permissionTree: mockFn([
        {
            "id": 1,
            "name": "用户管理",
            "code": "10000",
            "masterId": 1,
            "permissions": [],
            "parentId": 0
        },
        {
            "id": 2,
            "name": "角色管理",
            "code": "10000",
            "masterId": 1,
            "permissions": [],
            "parentId": 0
        },
        {
            "id": 3,
            "name": "机构管理",
            "code": "10000",
            "masterId": 1,
            "permissions": [],
            "parentId": 0
        },
        {
            "id": 4,
            "name": "数据源",
            "code": "40000",
            "masterId": 1,
            "permissions": [],
            "children": [
                {
                    "id": 41,
                    "name": "数据源管理",
                    "code": "40001",
                    "masterId": 1,
                    "permissions": [],
                    "children": null,
                    "parentId": 1
                },
                {
                    "id": 42,
                    "name": "数据源类型",
                    "code": "40002",
                    "masterId": 1,
                    "permissions": [],
                    "children": null,
                    "parentId": 1
                }
            ],
            "parentId": 0
        }
    ]),

    /*首页*/
    homeData: mockFn({
        'total': 5,
        'list|5': [
            {
                id() {
                    postId += 1
                    return postId
                },
                apiname: '@last',
                datasource: '@password',
                author: '@last',
                status: () => {
                    return Mock.mock('@pick(["待审批","使用中","已完成"])')
                },
                date: '@dateTime',
            },
        ],
    }),

    /*机构管理*/
    orgList: mockFn([
        {
            "id": 1,
            "name": "机构1",
            "code": "10000",
            "masterId": 1,
            "permissions": [],
            "children": [
                {
                    "id": 11,
                    "name": "机构01",
                    "code": "10001",
                    "masterId": 1,
                    "permissions": [],
                    "children": null,
                    "parentId": 1
                },
                {
                    "id": 12,
                    "name": "机构02",
                    "code": "10002",
                    "masterId": 1,
                    "permissions": [],
                    "children": null,
                }
            ],
            "parentId": 0
        },
        {
            "id": 2,
            "name": "机构2",
            "code": "20000",
            "masterId": 1,
            "permissions": [],
            "children": "",
            "parentId": 0
        },
        {
            "id": 3,
            "name": "机构3",
            "code": "30000",
            "masterId": 1,
            "permissions": [],
            "children": "",
            "parentId": 0
        },
        {
            "id": 4,
            "name": "机构4",
            "code": "40000",
            "masterId": 1,
            "permissions": [],
            "children": "",
            "parentId": 0
        }
    ]),

    /*角色管理*/
    roleList: mockFn({
        'total': 155,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId + 10000
                },
                name: '@name',
                remarks: '@last',
                registeTime: '@dateTime',
            },
        ],
    }),

    /*用户管理*/
    userList: mockFn({
        'total': 155,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId + 10000
                },
                'status|1-2': 1,
                name: '@last',
                password: '@password',
                role: '@last',
                regionCommunityId: '@name',
                regionCommunity: '@last',
                visibility: () => {
                    return Mock.mock('@pick(["Public",'
                        + '"Password protected", '
                        + '"Private"])')
                },
                registeTime: '@dateTime',
            },
        ],
    }),

    /*数据源管理*/
    sourceOne: mockFn({
        sourceName: 'admin',
        sourceId: 1
    }),
    sourceList: mockFn({
        'total': 35,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId + 10000
                },
                'status|1-2': 1,
                creator: '@last',
                name: '@name',
                type: () => {
                    return Mock.mock('@pick(["MySql","Hive","HBase"])')
                },
                date: '@dateTime',
            },
        ],
    }),

    /*数据源类型管理*/
    sourceTypeOne: mockFn(),
    sourceTypeList: mockFn({
        'total': 35,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId
                },
                creator: '@cname',
                name: '@name',
                type: () => {
                    return Mock.mock('@pick(["MySql","Hive","HBase"])')
                },
                date: '@dateTime',
            },
        ],
    }),

    /*数据接口管理*/
    myApiOne: mockFn(),
    myApiList: mockFn({
        'total': 35,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId
                },
                creator: '@cname',
                name: '@last',
                type: () => {
                    return Mock.mock('@pick(["MySql","Hive","HBase"])')
                },
                status: () => {
                    return Mock.mock('@integer(1,3)')
                },
                date: '@dateTime',
            },
        ],
    }),

    /*数据接口管理*/
    dataApiOne: mockFn(),
    dataApiList: mockFn({
        'total': 35,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId
                },
                creator: '@cname',
                name: '@last',
                type: () => {
                    return Mock.mock('@pick(["MySql","Hive","HBase"])')
                },
                status: () => {
                    return Mock.mock('@integer(1,3)')
                },
                date: '@dateTime',
            },
        ],
    }),

    /*接口详情*/
    apiDetailOne: mockFn(),

    /*模型接口管理*/
    modelApiOne: mockFn(),
    modelApiList: mockFn({
        'total': 35,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId
                },
                creator: '@cname',
                name: '@last',
                status: () => {
                    return Mock.mock('@integer(1,3)')
                },
                date: '@dateTime',
            },
        ],
    }),

    /*接口发布审批*/
    pushCheckOne: mockFn(),
    pushCheckList: mockFn({
        'total': 35,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId
                },
                creator: '@cname',
                name: '@last',
                type: () => {
                    return Mock.mock('@pick(["MySql","Hive","HBase"])')
                },
                status: () => {
                    return Mock.mock('@integer(1,3)')
                },
                date: '@dateTime',
            },
        ],
    }),

    /*接口使用审批*/
    useCheckOne: mockFn(),
    useCheckList: mockFn({
        'total': 35,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId
                },
                creator: '@cname',
                name: '@name',
                type: () => {
                    return Mock.mock('@pick(["MySql","Hive","HBase"])')
                },
                date: '@dateTime',
            },
        ],
    }),

    /*服务调用审计*/
    auditOne: mockFn(),
    auditList: mockFn({
        'total': 35,
        'list|10': [
            {
                id() {
                    postId += 1
                    return postId
                },
                username: '@cname',
                name: '@name',
                accessTime: '@dateTime',
            },
        ],
    }),
}