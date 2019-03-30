import React from 'react';
import {hot} from "react-hot-loader";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from "react-router-dom";
import Login from "./Login";

const Header = () => {
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
                                    <a className="nav-link" id="contact" href="#section-footer">Contact Us</a>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" id="signup" to="/signup">Sign Up</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" id="login" to="/login">Log In</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </Router>
    );
};

export default hot(module) (Header);