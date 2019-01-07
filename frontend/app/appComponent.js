import React, {Component} from 'react';
import {connect} from 'react-redux';

import {userActions} from './userActions';

class App extends Component {
    componentWillMount() {
        // When the component initialises on first run, request the user status
        this.props.getUserStatus()
    }

    login(e) {
        e.preventDefault(); // Prevent post event bubbling

        // Get the username and password credentials
        const username = this.username.value;
        const password = this.password.value;

        this.props.login(username, password);
    }

    logout(e) {
        e.preventDefault();
        this.props.logout();
    }

    render() {
        const {user, isLoggingIn, errorMessage} = this.props;
        const {state} = this.props; // The state prop is for debugging purposes

        let userPanel;
        switch (user) {
            case null:
                userPanel = <div>Loading...</div>;
                break;
            case false:
                userPanel = (
                    <div>
                        <p>Login with username demo and password demo</p>
                        <form onSubmit={this.login.bind(this)}>
                            {errorMessage && (
                                <p style={{color: 'red'}}>{errorMessage}</p>
                            )}
                            <label>Username</label><br/>
                            <input type="text" ref={e => this.username = e} defaultValue="demo"/>

                            <p>&nbsp;</p>

                            <label>Password</label><br/>
                            <input type="text" ref={p => this.password = p} defaultValue="demo"/>

                            <p>&nbsp;</p>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                );
                break;
            default:
                // The user is logged in as the user parameter is not false or null
                const {firstName, lastName} = user;
                userPanel = (
                    <div>
                        <p>Hello, {firstName} {lastName}!</p>
                        <button onClick={this.logout.bind(this)} disabled={isLoggingIn}>Logout</button>
                    </div>
                )
        }

        return (
            <div>
                {userPanel}
                {/* Dump the redux state for debugging purposes */}
                <pre style={{background: '#CCC'}}>{JSON.stringify(state, null, 4)}</pre>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        state,
        // The user is either null, false or contains a dictionary
        user: state.userReducer.user,
        isLoggingIn: state.userReducer.isLoggingIn,
        errorMessage: state.userReducer.errorMessage,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getUserStatus: () => {
            dispatch(userActions.getUserStatus())
        },
        login: (username, password) => {
            dispatch(userActions.login(username, password))
        },
        logout: () => {
            dispatch(userActions.logout())
        },
    }
};

export default App = connect(mapStateToProps, mapDispatchToProps)(App);