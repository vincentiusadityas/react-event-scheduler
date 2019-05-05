import React, {Component} from 'react';
import {hot} from "react-hot-loader";
import {
    Link
} from "react-router-dom";

import SignOutButton from './Signout';
import * as ROUTES from '../constants/routes';
import { AuthUserContext } from './Session';
import $ from "jquery";

class Header extends Component{
    constructor(props) {
        super(props);
        this.currentLocation = window.location.pathname.toString();

        if (this.currentLocation === "/") {
            this.currentLocation = "";
        }

        // this.authUser = this.props.authUser;
        // console.log(this.authUser);
        $(function() {
            $('a[href*=\\#section]').on('click', function(e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
            });
        });
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top cust-nav">
                    <div className="container">
                        <AuthUserContext.Consumer>
                            {authUser => authUser ?
                                <Link className="navbar-brand" to={ROUTES.BROWSE_EVENT}>
                                    {/*<img id="logo" src="./../img/groupevent.ico" alt=""/>*/}
                                    MyEvent
                                </Link>
                                :
                                <Link className="navbar-brand" to={ROUTES.LANDING}>
                                    {/*<img id="logo" src="./../img/groupevent.ico" alt=""/>*/}
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
                                <AuthUserContext.Consumer>
                                    {authUser => authUser ?
                                        <div>
                                            {/*<li className="nav-item">*/}
                                                {/*<a className="nav-link" id="search-event">Search Events</a>*/}
                                            {/*</li>*/}
                                            <li className="nav-item">
                                                <Link className="nav-link" id="create-event" to={ROUTES.CREATE_EVENT}>Create Event</Link>
                                            </li>
                                            <li className="nav-item line-separator">
                                                <a className="nav-link" id="contact" href={this.currentLocation + "#section-footer"}>Contact Us</a>
                                            </li>
                                        </div>
                                        :
                                        <div>
                                            <li className="nav-item">
                                                <Link className="nav-link" id="search-event" to={ROUTES.BROWSE_EVENT}>Browse Event</Link>
                                            </li>
                                            <li className="nav-item line-separator">
                                                <a className="nav-link" id="contact" href={this.currentLocation + "#section-footer"}>Contact Us</a>
                                            </li>
                                        </div>
                                    }
                                </AuthUserContext.Consumer>
                                <AuthUserContext.Consumer>
                                    {authUser => authUser ?
                                        <div>
                                            <li className="nav-item">
                                                <Link className="nav-link" id="my-account" to={ROUTES.ACCOUNT}>{authUser.email}</Link>
                                            </li>
                                            <li className="nav-item">
                                                <SignOutButton/>
                                            </li>
                                        </div>
                                        :
                                        <div>
                                            <li className="nav-item">
                                                <Link className="nav-link" id="signup" to={ROUTES.SIGN_UP}>Sign Up</Link>
                                            </li>
                                            <li className="nav-item">
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
