import React, {Component} from 'react';
import {hot} from "react-hot-loader";
import {
    BrowserRouter as Router,
    Link} from "react-router-dom";
import * as ROUTES from '../constants/routes';

class Header extends Component{
    constructor(props) {
        super(props);
        this.currentLocation = window.location.pathname.toString();

        if (this.currentLocation == "/") {
            this.currentLocation = "";
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top cust-nav">
                        <div className="container">
                            <a className="navbar-brand" href="">
                                {/*<img id="logo" src="img/groupevent.ico"> </img>*/}
                                MyEvent
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive"
                                    aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav ml-auto right-bar">
                                    <li className="nav-item line-separator">
                                        <a className="nav-link" id="contact" href={this.currentLocation + "#section-footer"}>Contact Us</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="signup" href={ROUTES.SIGN_UP}>Sign Up</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="login" href={ROUTES.LOG_IN}>Log In</a>
                                        {/*<Link className="nav-link" id="login" onClick={() => window.location.refresh()} to={ROUTES.LOG_IN}>Log In</Link>*/}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </Router>
        );
    }

};

export default hot(module) (Header);