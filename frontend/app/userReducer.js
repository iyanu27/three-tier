import {USER_ACTIONS} from './userActions';

const userState = {
    /*
        The user parameter can have 3 values -

        null - the default value when initialising the application
        false - the user is not logged in
        {user} - a dictionary containing the user's details, e.g. first name, last name

        Since the getUserStatus action is called on initialisation, this value will be updated to either false or {user}
     */
    user: null,
    isLoggingIn: false, // A boolean that is true when a call is made to login
    errorMessage: null, // A string containing an error message if the login is unsuccessful
};

function userReducer(state = userState, action) {
    switch (action.type) {
        case USER_ACTIONS.SET_USER_STATUS:
            const {user: userStatus} = action;
            return {...state, user: userStatus};
        case USER_ACTIONS.START_LOGIN:
            return {...state, isLoggingIn: true};
        case USER_ACTIONS.END_LOGIN:
            return {...state, isLoggingIn: false};
        case USER_ACTIONS.LOGIN_FAILURE:
            const {message: errorMessage} = action;
            return {...state, errorMessage: errorMessage};
        case USER_ACTIONS.LOGIN_RESET:
            return {...state, errorMessage: null};
        default:
            return state;
    }
}

export default userReducer;