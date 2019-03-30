import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import '../src/css/mycss.css'
import Header from './Header'
import Main from './Main'
import Footer from "./Footer";

const App = () => {
  return (
      <div>
        <Header/>
        <Main/>
        <Footer/>
      </div>
  );
};

export default hot(module)(App);
