import {combineReducers} from 'redux'
import app, * as apps from './app'
import login, * as logins from './login'
import home, * as homes from './home'
import user, * as users from './user'
import org, * as orgs from './org'
import role, * as roles from './role'  
import sourceList, * as sourceLists from './source/list'
import sourceType, * as sourceTypes from './source/type'
import sourceManage, * as sourceManages from './source/manage'
import myApi, * as myApis from './api/myApi'
import apiDetail, * as apiDetails from './api/apiDetail'
import dataApi, * as dataApis from './api/dataApi'
import modelApi, * as modelApis from './api/modelApi'
import pushCheck, * as pushChecks from './api/pushCheck'
import useCheck, * as useChecks from './api/useCheck'
import situation, * as situations from './monitor/situation'
import audit, * as audits from './monitor/audit'

const rootReducer = {
    app,
    home,
    login,
    user,
    org,
    role,
    sourceList,
    sourceType,
    sourceManage,
    myApi,
    apiDetail,
    dataApi,
    modelApi,
    pushCheck,
    useCheck,
    situation,
    audit,
}

const domains = {
    apps,
    homes,
    logins,
    users,
    orgs,
    roles,
    sourceLists,
    sourceTypes,
    sourceManages,
    myApis,
    apiDetails,
    dataApis,
    modelApis,
    pushChecks,
    useChecks,
    situations,
    audits,
}

let subscriptionHolder = []

for (const key in domains) {
    if (Object.prototype.hasOwnProperty.call(domains, key)) {
        const {actions, subscriptions} = domains[key]
        subscriptions && subscriptionHolder.push({subscriptions, actions})
    }
}

export {subscriptionHolder, rootReducer}