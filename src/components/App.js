import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import {
    BrowserRouter as Router
} from 'react-router-dom'
import '../css/App.css';
import '../css/mycss.css'
import Header from './Header'
import Main from './Main'
import Footer from "./Footer";

class App extends Component{

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Router>
                <div>
                    <Header/>
                    <Main/>
                    <Footer/>
                </div>
            </Router>
        );
    };
};

export default hot(module)(App);
