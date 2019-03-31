import React, {Component} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route } from 'react-router-dom'

import Home from './Home'
import Login from './Login'
import SignUp from './Signup'

import * as ROUTES from '../constants/routes';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"

class Main extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path={ROUTES.LANDING} component={Home}/>
                    <Route path={ROUTES.LOG_IN} component={Login}/>
                    <Route path={ROUTES.SIGN_UP} component={SignUp}/>
                </Switch>
            </Router>
        );
    };
};

export default Main