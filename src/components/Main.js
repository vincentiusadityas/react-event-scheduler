import React, {Component} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route, withRouter
} from 'react-router-dom'

import * as ROUTES from '../constants/routes';
import Landing from './Landing'
import Login from './Login'
import SignUp from './Signup'
import Home from "./Home";
import Account from "./Account";
import PasswordForgetPage from "./PasswordForget";
import AfterResetPage from "./AfterResetPassword";
import CreateEvent from "./CreateEvent";
import Event from "./Event";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"

class Main extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
                <Switch>
                    <Route exact path={ROUTES.LANDING} component={withRouter(Landing)}/>
                    <Route path={ROUTES.HOME} component={withRouter(Home)}/>
                    <Route path={ROUTES.ACCOUNT} component={withRouter(Account)}/>
                    <Route path={ROUTES.LOG_IN} component={withRouter(Login)}/>
                    <Route path={ROUTES.SIGN_UP} component={withRouter(SignUp)}/>
                    <Route path={ROUTES.PASSWORD_FORGET} component={withRouter(PasswordForgetPage)}/>
                    <Route path={ROUTES.AFTER_RESET} component={withRouter(AfterResetPage)}/>
                    <Route path={ROUTES.CREATE_EVENT} component={withRouter(CreateEvent)}/>
                    <Route path={ROUTES.EVENT} component={withRouter(Event)}/>
                </Switch>
        );
    };
};

export default Main