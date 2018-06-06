const {api} = require('../utils/config')

module.exports = {
    [api.appGetToken + '*' ]: "/getToken",
    [api.appLogout + '*' ]: "/sucCommon",
    [api.appUserInfo + '*' ]: "/userInfo",
    [api.appPermission + '*' ]: "/permissionTree",

    [api.homeData + '*' ]: "/homeData",

    /*用户管理*/
    [api.userList + '*' ]: "/userList",
    [api.userUpdate + '*' ]: "/sucCommon",
    [api.userDel + '*' ]: "/sucCommon",

    [api.orgList + '*' ]: "/orgList",
    [api.orgUpdate + '*' ]: "/sucCommon",
    [api.orgDel + '*' ]: "/sucCommon",

    [api.roleList + '*' ]: "/roleList",
    [api.roleUpdate + '*' ]: "/sucCommon",
    [api.roleDel + '*' ]: "/sucCommon",

    [api.sourceOne + '*' ]: "/sourceOne",
    [api.sourceList + '*' ]: "/sourceList",
    [api.sourceUpdate + '*' ]: "/sucCommon",
    [api.sourceDel + '*' ]: "/sucCommon",

    [api.sourceTypeOne + '*' ]: "/sourceTypeOne",
    [api.sourceTypeList + '*' ]: "/sourceTypeList",
    [api.sourceTypeUpdate + '*' ]: "/sucCommon",
    [api.sourceTypeDel + '*' ]: "/sucCommon",

    [api.dataApiOne + '*' ]: "/dataApiOne",
    [api.dataApiUpdate + '*' ]: "/sucCommon",
    [api.dataApiDel + '*' ]: "/sucCommon",
    [api.dataApiList + '*' ]: "/dataApiList",

    [api.apiDetailOne + '*' ]: "/apiDetailOne",

    [api.modelApiOne + '*' ]: "/modelApiOne",
    [api.modelApiList + '*' ]: "/modelApiList",
    [api.modelApiUpdate + '*' ]: "/sucCommon",
    [api.modelApiDel + '*' ]: "/sucCommon",

    [api.pushCheckOne + '*' ]: "/pushCheckOne",
    [api.pushCheckList + '*' ]: "/pushCheckList",
    [api.pushCheckUpdate + '*' ]: "/sucCommon",
    [api.pushCheckDel + '*' ]: "/sucCommon",

    [api.useCheckOne + '*' ]: "/useCheckOne",
    [api.useCheckList + '*' ]: "/useCheckList",
    [api.useCheckUpdate + '*' ]: "/sucCommon",
    [api.useCheckDel + '*' ]: "/sucCommon",

    [api.auditOne + '*' ]: "/auditOne",
    [api.auditList + '*' ]: "/auditList",
}