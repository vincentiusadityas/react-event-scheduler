import React, { Component } from 'react';

import { withFirebase } from './Firebase';
import * as ROUTES from '../constants/routes';
import {Link, withRouter} from "react-router-dom";
import {hot} from "react-hot-loader";

const PasswordForgetPage = () => (
    <div>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push({
                    pathname: ROUTES.AFTER_RESET,
                    state: {
                        email: email
                    }
                });
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email } = this.state;

        return (
            <div className="bg">
                <div className="error-message">
                </div>
                <section id="section-forget-password">
                    <article className="card-body mx-auto">
                        <h4 className="card-title text-center">Forget Password</h4>
                        <p className="text-center text-hint"> Enter your email address to reset your password </p>

                        <form onSubmit={this.onSubmit}>
                            <div className="form-group input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                                </div>
                                <input className="form-control" placeholder="Email address" name="email"
                                       value={email} onChange={this.onChange} type="text" required/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block" id="btn-login"> Reset My Password
                                </button>
                            </div>
                            <p className="text-center">Are you new? Register
                                <Link to={ROUTES.SIGN_UP}> here</Link>.
                            </p>
                            <p className="text-center"> Remember your password?
                                <Link to={ROUTES.LOG_IN}> Log In </Link> now.
                            </p>
                        </form>
                    </article>
                </section>
            </div>
        );
    }
}

const PasswordForgetForm = withRouter(withFirebase(PasswordForgetFormBase));

export default hot(module) (PasswordForgetPage);
