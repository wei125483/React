import React, {Component} from 'react'
import {
    Router,
    Route,
    Switch
} from 'react-router-dom'
import {Provider} from 'react-redux'
import {history} from 'utils'
import asyncComponent from 'components/AsyncComponent'
import App from 'components/App'
import configureStore from 'store';

const store = configureStore(window.__INITIAL_STATE__)
const Login = asyncComponent(() => import('./Login'))
const Home = asyncComponent(() => import('./Home'))
const My = asyncComponent(() => import('./My'))
const User = asyncComponent(() => import('./User'))
const Org = asyncComponent(() => import('./Org'))
const Role = asyncComponent(() => import('./Role'))
const SourceList = asyncComponent(() => import('./Source/SourceList'))
const SourceType = asyncComponent(() => import('./Source/SourceType'))
const SourceManage = asyncComponent(() => import('./Source/SourceManage'))
const MyApi = asyncComponent(() => import('./Api/MyApi'))
const ApiDetail = asyncComponent(() => import('./Api/Detail'))
const DataApi = asyncComponent(() => import('./Api/DataApi'))
const ModelApi = asyncComponent(() => import('./Api/ModelApi'))
const PushCheck = asyncComponent(() => import('./Api/PushCheck'))
const UseCheck = asyncComponent(() => import('./Api/UseCheck'))
const Situation = asyncComponent(() => import('./Monitor/Situation'))
const Audit = asyncComponent(() => import('./Monitor/Audit'))

class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Switch>
                        <App location={history.location}>
                            <Route path="/" component={Home} exact/>
                            <Route path="/my" component={My}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/user" component={User}/>
                            <Route path="/org" component={Org}/>
                            <Route path="/role" component={Role}/>
                            <Route path="/source/list" component={SourceList}/>
                            <Route path="/source/type" component={SourceType}/>
                            <Route path="/dataApi/manage" component={SourceManage}/>
                            <Route path="/myApi/list" component={MyApi}/>
                            <Route path="/api/detail/:id" component={ApiDetail}/>
                            <Route path="/dataApi/list" component={DataApi}/>
                            <Route path="/modelApi/list" component={ModelApi}/>
                            <Route path="/pushCheck/list" component={PushCheck}/>
                            <Route path="/useCheck/list" component={UseCheck}/>
                            <Route path="/monitor/situation" component={Situation}/>
                            <Route path="/monitor/audit" component={Audit}/>
                        </App>
                    </Switch>
                </Router>
            </Provider>
        )
    }
}

export default Root