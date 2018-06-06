// 如果是开发模式，store 采用此配置

import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { routerMiddleware, routerReducer, syncHistoryWithStore } from 'react-router-redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { createLogger } from 'redux-logger'
import { history as createHistory } from 'utils'
import rootSage from 'sagas'
import { rootReducer, subscriptionHolder } from 'reducers'

const configureStore = preloadedState => {
	const sagaMiddleware = createSagaMiddleware()
	const loggerMiddleware = createLogger()
	const routerReduxMiddleware = routerMiddleware(createHistory)
	const middleware = [sagaMiddleware, routerReduxMiddleware, loggerMiddleware]

	const store = createStore(
		combineReducers({
			...rootReducer,
			routing: routerReducer
		}),
		preloadedState,
		compose(
			applyMiddleware(...middleware)
			// applyMiddleware 是redux的原生方法，它将所有中间件组成一个数组，依次执行。
		)
	)

	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('../reducers', () => {
			const nextRootReducer = require('../reducers').rootReducer
			store.replaceReducer(nextRootReducer)
		})
	}
	//store.runSaga = sagaMiddleware.run
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

export default configureStore