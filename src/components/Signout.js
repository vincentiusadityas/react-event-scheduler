import React from 'react';

import { withFirebase } from './Firebase';

const SignOutButton = ({ firebase }) => (
    <button type="button" id="sign-out-btn" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

export default withFirebase(SignOutButton);