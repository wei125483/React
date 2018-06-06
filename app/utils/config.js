const API = '/api'

module.exports = {
    name: '车站大脑数据共享服务中心',
    prefix: 'QX_',
    footerText: '车站大脑数据共享服务中心  © 2018',
    noLoginPages: ['/login', '/register'],
    API,
    api: {
        //appLogin: `${API}/login`,
        appGetToken: `${API}/oauth/token`,
        appLogout: `${API}/logout`,
        appUserInfo: `${API}/user/get`,
        appUserSave: `${API}/user/save`,
        appPermission: `${API}/permission/tree`,
        appUpdate: `${API}/office/sync`,

        /*首页*/
        homeData: `${API}/database/sysManage/interface/statisticsAll`,

        /*用户管理*/
        userList: `${API}/user/list`,
        userUpdate: `${API}/user/save`,
        userDel: `${API}/user/delete`,

        /*机构管理*/
        orgList: `${API}/office/tree`,
        orgUpdate: `${API}/office/save`,
        orgDel: `${API}/office/delete`,

        /*角色管理*/
        roleList: `${API}/role/list`,
        roleUpdate: `${API}/role/save`,
        roleDel: `${API}/role/delete`,

        /*数据源管理*/
        sourceList: `${API}/database/list`,
        sourceTable: `${API}/server/tbNames`,
        sourceCol: `${API}/server/colNames`,
        sourceCheckUrl: `${API}/server/check`,
        sourceUpdate: `${API}/database/save`,
        sourceDel: `${API}/database/delete`,
        sourceTest: `${API}/database/testConn`,

        /*数据源类型管理*/
        sourceTypeList: `${API}/database/type/list`,
        sourceTypeUpdate: `${API}/database/type/save`,
        sourceTypeDel: `${API}/database/type/delete`,

        /*接口组管理*/
        sourceManageList: `${API}/serviceSystem/list`,
        sourceManageUpdate: `${API}/serviceSystem/save`,
        sourceManageDel: `${API}/serviceSystem/delete`,

        /*我的接口*/
        myApiOne: `${API}/api/myApiOne`,
        myApiList: `${API}/api/myApiList`,
        myApiUpdate: `${API}/api/myApiUpdate`,
        myApiDel: `${API}/server/apply/delete`,
        myReleaseApiDel: `${API}/server/delete`,

        /*接口详情*/
        apiDetailOne: `${API}/server/detail`,

        /*数据接口管理*/
        dataApiOne: `${API}/api/dataApiOne`,
        dataApiList: `${API}/server/list`,
        dataApiAdd: `${API}/server/save`,
        dataApiApply: `${API}/server/apply`,
        dataApiBacthRemove: `${API}/server/delete`,
        dataApplyBacthRemove: `${API}/server/apply/delete`,
        dataApiStop: `${API}/server/stop`,
        dataApiStart: `${API}/server/start`,
        dataApiUpdate: `${API}/api/dataApiUpdate`,
        dataApiDel: `${API}/api/dataApiDel`,
        hBaseTable: `${API}/server/hbase/tbName`,
        hBaseCol: `${API}/server/hbase/columnFamilies`,

        /*模型接口管理*/
        modelApiOne: `${API}/api/modelApiOne`,
        modelApiList: `${API}/api/modelApiList`,
        modelApiUpdate: `${API}/api/modelApiUpdate`,
        modelApiDel: `${API}/api/dmodelApiDel`,

        /*数据发布审批*/
        pushCheckOne: `${API}/api/pushCheckOne`,
        pushCheckList: `${API}/api/pushCheckList`,
        pushCheckUpdate: `${API}/api/pushCheckUpdate`,
        pushCheckApproval: `${API}/server/approval`,
        pushCheckApply: `${API}/server/apply/approval`,
        pushCheckDel: `${API}/api/pushCheckDel`,

        /*数据使用审批*/
        useCheckOne: `${API}/api/useCheckOne`,
        useCheckList: `${API}/server/apply/list`,
        useCheckUpdate: `${API}/api/useCheckUpdate`,
        useCheckDel: `${API}/api/useCheckDel`,

        /*服务调用审计*/
        auditList: `${API}/database/sysManage/audit/list`,

        /*服务访问情况*/
        situationInfo: `${API}/database/sysManage/interface/statistics`,
        situationMap: `${API}/database/sysManage/interface/listPast`,
    },
    reg: {
        // 电话号码
        phone:  /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
        // 手机号码
        mobile:  /^1\d{10}$/,
        // IP地址
        host:   /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        // 端口号 0---65535
        port: /^\d{1,5}$/,
    }
} 