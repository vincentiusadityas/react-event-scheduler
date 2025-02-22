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

import { withAuthentication } from './Session';

const App = () => (
    <main>
        <div>
            <Header />
            <Main />
            <Footer />
        </div>
    </main>
);

export default hot(module) (withAuthentication(App));
