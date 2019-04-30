import React from 'react';

import { withFirebase } from './Firebase';
import {hot} from "react-hot-loader";

const SignOutButton = ({ firebase }) => (
    <button type="button" id="sign-out-btn" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

export default hot(module) (withFirebase(SignOutButton));