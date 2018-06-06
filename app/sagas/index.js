import {all} from 'redux-saga/effects'
import {loginSagas} from './login'
import {appSagas} from './app'
import {homeSagas} from './home'
import {userSagas} from './user'
import {orgSagas} from './org'
import {roleSagas} from './role'
import {sourceListSagas} from './source/list'
import {sourceTypeSagas} from './source/type'
import {sourceManageSagas} from './source/manage'
import {myApiSagas} from './api/myApi'
import {apiDetailSagas} from './api/apiDetail'
import {dataApiSagas} from './api/dataApi'
import {modelApiSagas} from './api/modelApi'
import {pushCheckSagas} from './api/pushCheck'
import {useCheckSagas} from './api/useCheck'
import {situationSagas} from './monitor/situation'
import {auditSagas} from './monitor/audit'

export default function* sagas() {
    yield all([
        ...appSagas,
        ...loginSagas,
        ...homeSagas,
        ...userSagas,
        ...orgSagas,
        ...roleSagas,
        ...sourceListSagas,
        ...sourceTypeSagas,
        ...sourceManageSagas,
        ...myApiSagas,
        ...apiDetailSagas,
        ...dataApiSagas,
        ...modelApiSagas,
        ...pushCheckSagas,
        ...useCheckSagas,
        ...situationSagas,
        ...auditSagas,
    ])
}

// 相关API参考 https://neighborhood999.github.io/redux-saga/docs/api/index.html
// delay 延迟执行
// takeEvery 监控某个动作，如果该动作被触发，则执行传入的 saga，如果动作被多次触发，则依次执行
// takeLatest 监控某个动作，如果该动作被出发，则执行传入的 saga，如果动作被多次触发，则只执行最新的动作
// buffers 限制存入序列的动作数量  const requestChan = yield actionChannel('REQUEST', buffers.sliding(5))
// channel
// eventChannel 为 Redux Store 以外的事件来源建立一个 Channel
// END 事件，监控的终止

// put 调用动作，dispatch adtion
// take 监控某个动作
// call 异步调用，阻塞
// fork 异步调用，非阻塞（分流）
// actionChannel 依次处理每个被监控的动作
// select
// cancelled