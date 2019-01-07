import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store from './store';
import App from './appComponent'

// Connect the app to the redux store
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);


// Allow hot reloads when in development mode
if (module.hot) {
    module.hot.accept();
}