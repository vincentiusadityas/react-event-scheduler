import React from 'react';

import { withAuthorization } from './Session';

const Home = () => (
    <div>
        <section id="section01">
            <div className="container top-pg">
                <h1>Home Page</h1>
                <p>The Home Page is accessible by every signed in user.</p>
                <p>This page is not yet available for usage, please navigate to other page!</p>
            </div>
        </section>
    </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
