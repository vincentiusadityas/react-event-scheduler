import React, {Component} from 'react';
import {hot} from "react-hot-loader";
import {
    Link
} from "react-router-dom";

import SignOutButton from './Signout';
import * as ROUTES from '../constants/routes';
import { AuthUserContext } from './Session';

class Header extends Component{
    constructor(props) {
        super(props);
        this.currentLocation = window.location.pathname.toString();

        if (this.currentLocation == "/") {
            this.currentLocation = "";
        }

        // this.authUser = this.props.authUser;
        // console.log(this.authUser);
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top cust-nav">
                    <div className="container">
                        <AuthUserContext.Consumer>
                            {authUser => authUser ?
                                <Link className="navbar-brand" to={ROUTES.HOME}>
                                    {/*<img id="logo" src="img/groupevent.ico"> </img>*/}
                                    MyEvent
                                </Link>
                                :
                                <Link className="navbar-brand" to={ROUTES.LANDING}>
                                    {/*<img id="logo" src="img/groupevent.ico"> </img>*/}
                                    MyEvent
                                </Link>
                            }
                        </AuthUserContext.Consumer>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
                                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav ml-auto right-bar">
                                <li className="nav-item line-separator">
                                    <a className="nav-link" id="contact" href={this.currentLocation + "#section-footer"}>Contact Us</a>
                                </li>
                                <AuthUserContext.Consumer>
                                    {authUser => authUser ?
                                        <div>
                                            <li className="nav-item">
                                                <Link className="nav-link" id="signup" to={ROUTES.LANDING}>{authUser.email}</Link>
                                            </li>
                                            <li className="nav-item">
                                                <SignOutButton/>
                                            </li>
                                        </div>
                                        :
                                        <div>
                                            <li className="nav-item">
                                                {/*<a className="nav-link" id="signup" href={ROUTES.SIGN_UP}>Sign Up</a>*/}
                                                <Link className="nav-link" id="signup" to={ROUTES.SIGN_UP}>Sign Up</Link>
                                            </li>
                                            <li className="nav-item">
                                                {/*<a className="nav-link" id="login" href={ROUTES.LOG_IN}>Log In</a>*/}
                                                {/*<Link className="nav-link" id="login" onClick={() => window.location.refresh()} to={ROUTES.LOG_IN}>Log In</Link>*/}
                                                <Link className="nav-link" id="login" to={ROUTES.LOG_IN}>Log In</Link>
                                            </li>
                                        </div>
                                    }
                                </AuthUserContext.Consumer>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    };
};

export default hot(module) (Header);