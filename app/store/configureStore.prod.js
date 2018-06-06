// 如果是产品（打包）模式，store 采用此配置

import { createStore, applyMiddleware, combineReducers } from 'redux'
import { routerMiddleware, routerReducer, syncHistoryWithStore } from 'react-router-redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { history as createHistory } from 'utils'
import rootSage from 'sagas'
import { rootReducer, subscriptionHolder } from 'reducers'

export default function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware()
    const routerReduxMiddleware = routerMiddleware(createHistory)
    const store = createStore(
        combineReducers({
			...rootReducer,
			routing: routerReducer
		}),
        initialState,
        applyMiddleware(sagaMiddleware, routerReduxMiddleware)
    )

    sagaMiddleware.run(rootSage)
    store.close = () => store.dispatch(END)
    const history = syncHistoryWithStore(createHistory, store)
	const unListeners = []
	subscriptionHolder.forEach(({ subscriptions, actions }) => {
		for (const method in subscriptions) {
			if ({}.hasOwnProperty.call(subscriptions, method)) {
				unListeners.push(subscriptions[method]({ history, ...store }, actions))
			}
		}
	})

    return store
}
