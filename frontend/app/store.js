import {createStore, combineReducers, applyMiddleware} from 'redux';
import logger from 'redux-logger'
import ReduxThunk from 'redux-thunk'
import userReducer from './userReducer';

// Create the redux store using the user reducer
const store = createStore(
    combineReducers(
        {
            userReducer,
        }
    ),
    applyMiddleware(ReduxThunk, logger),
);

// Hot reload of store if file changes
if (module.hot) {
    module.hot.accept('./userReducer', () => {
        const nextRootReducer = require('./userReducer');
        const finalReducer = {...nextRootReducer};
        store.replaceReducer(combineReducers(finalReducer));
    })
}

export default store;