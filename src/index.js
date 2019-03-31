import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';

render((
    <BrowserRouter>
        <FirebaseContext.Provider value={new Firebase()}>
            <App />
        </FirebaseContext.Provider>
    </BrowserRouter>
), document.getElementById('root'));