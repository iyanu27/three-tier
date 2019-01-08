import axios from 'axios' // Axios is a promise-based http client library

export const USER_ACTIONS = {
    SET_USER_STATUS: 'USER_ACTIONS.SET_USER_STATUS',
    START_LOGIN: 'USER_ACTIONS.START_LOGIN',
    END_LOGIN: 'USER_ACTIONS.END_LOGIN',
    LOGIN_SUCCESS: 'USER_ACTIONS.LOGIN_SUCCESS',
    LOGIN_FAILURE: 'USER_ACTIONS.LOGIN_FAILURE',
    LOGIN_RESET: 'USER_ACTIONS.LOGIN_RESET'
};

const API_PREFIX = (process.env.NODE_ENV === 'production') ? '' : '/api';

export const userActions = {
    getUserStatus: () => dispatch => {
        axios.get(`${API_PREFIX}/user/status`).then(
            response => {
                const {user} = response.data;
                if (user === undefined) {
                    console.log('unexpected error: expected user parameter, but is undefined');
                }
                dispatch({type: USER_ACTIONS.SET_USER_STATUS, user});
            }
        ).catch(error => {
            // Unauthorized
            if (error.response.status === 401) {
                dispatch({type: USER_ACTIONS.SET_USER_STATUS, user: false});
            } else {
                alert(`an error occurred: ${error}`); // Not expecting any other errors
            }
        })
    },

    login: (username, password) => dispatch => {
        dispatch({type: USER_ACTIONS.LOGIN_RESET}); // Reset login message
        dispatch({type: USER_ACTIONS.START_LOGIN}); // Reset loading message

        axios.post(`${API_PREFIX}/user/login`, {username, password}).then(
            response => {
                const {user} = response.data;
                if (user === undefined) {
                    console.log('Unexpected error: expected user parameter, but is undefined');
                }
                dispatch({type: USER_ACTIONS.SET_USER_STATUS, user});
            }
        ).catch(error => {
            let message = "An unknown error occurred. Please try again later";
            if (error.response && error.response.hasOwnProperty('data')) {
                message = error.response.data.message || message;
            }
            dispatch({type: USER_ACTIONS.LOGIN_FAILURE, message})
        }).finally(() => {
            dispatch({type: USER_ACTIONS.END_LOGIN});
        });
    },

    logout: (username, password) => dispatch => {
        // Set user status to false on logout
        axios.post(`${API_PREFIX}/user/logout`, {username, password}).then(
            response => {
                dispatch({type: USER_ACTIONS.SET_USER_STATUS, user: false});
            }
        ).catch(error => {
            dispatch({type: USER_ACTIONS.SET_USER_STATUS, user: false});
            console.log(`An error occurred: ${error}`); // Not expecting any errors
        })
    },
};