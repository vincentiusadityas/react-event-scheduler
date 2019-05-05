import React, { Component } from 'react';

import * as ROUTES from '../constants/routes';
import {Link, withRouter} from "react-router-dom";

const AfterResetPage = () => (
    <div>
        <AfterReset />
    </div>
);

class AfterResetBase extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.location.state;
    }

    render() {
        const { email } = this.state;
        if (email === null) {
            return (
                <div className="bg">
                    <section id="section-forget-password">
                        <h1>
                            ERROR
                        </h1>
                    </section>
                </div>
            )
        } else {
            return (
                <div className="bg">
                    <section id="section-forget-password">
                        <article className="card-body mx-auto">
                            <h4 className="card-title text-center">Success!</h4>
                            <p className="text-center text-hint"> A link to reset your password has been sent
                                to {email}. </p>
                            <p className="text-center text-hint"> Please login again after you have reset your
                                password. </p>

                            <p className="text-center">
                                <Link to={ROUTES.LOG_IN}> Log In </Link>again now.
                            </p>
                        </article>
                    </section>
                </div>
            );
        }
    }
}

const AfterReset = withRouter(AfterResetBase);

export default AfterResetPage;
