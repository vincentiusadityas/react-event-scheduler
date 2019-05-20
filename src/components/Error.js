import React from 'react';

import { withAuthorization } from './Session';

const Error = props => (
    <div>
        <section id="section01">
            <div className="container top-pg">
                <h1>Error Page</h1>
                <p>The Error Page is accessible by every signed in user.</p>
            </div>
        </section>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Error);
