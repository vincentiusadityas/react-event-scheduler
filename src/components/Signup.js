import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {hot} from "react-hot-loader";
import $ from "jquery";

import { withFirebase } from './Firebase';
import * as ROUTES from '../constants/routes';

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const SignUp = () => (
    <div>
        <SignUpForm />
    </div>
);

class SignUpFormBase extends Component {

    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };

        $(function() {
            $('#password, #confirm-password').on('keyup', function () {
                const confirm_password = document.getElementById("confirm-password");
                // console.log($('#password').val() == $('#confirm-password').val())
                if ($('#password').val() == $('#confirm-password').val()) {
                    confirm_password.setCustomValidity("");
                } else {
                    confirm_password.setCustomValidity("Passwords Don't Match");
                }
            });
        });
    };

    onSubmit = event => {
        console.log("hehe")
        event.preventDefault();
        console.log("haha")
        console.log(this.state);

        const { email, passwordOne } = this.state;

        console.log(email);
        console.log(passwordOne);

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.LOG_IN);
            })
            .catch(error => {
                this.setState({ error });
            });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            firstName,
            lastName,
            email,
            passwordOne,
            passwordTwo,
        } = this.state;

        return (
            <div className="bg">
                <section id="section-myform">
                    <article className="card-body mx-auto">
                        <h4 className="card-title text-center">Create Account</h4>
                        <p className="text-center text-hint"> Sign up with your social media account or email address </p>

                        <div className="social-btn text-center">
                            <a href="/signup" className="btn btn-primary btn-lg"><i className="fa fa-facebook"></i> Facebook</a>
                            <a href="/signup" className="btn btn-danger btn-lg"><i className="fa fa-google"></i> Google</a>
                        </div>

                        <p className="divider-text">
                            <span><b>OR</b></span>
                        </p>

                        <form onSubmit={this.onSubmit}>
                            <div className="form-group input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                                    <div>
                                        <input type="text" className="form-control" name="firstName" value={firstName}
                                               onChange={this.onChange} placeholder="First Name" required>
                                        </input>
                                    </div>
                                    <div>
                                        <input type="text" className="form-control" name="lastName" value={lastName}
                                               onChange={this.onChange} placeholder="Last Name" required>

                                        </input>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                                </div>
                                <input className="form-control" placeholder="Email address" name="email"
                                       onChange={this.onChange} value={email} type="email" required>

                                </input>
                            </div>
                            <div className="form-group input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                                </div>
                                <input id="password" className="form-control" placeholder="Create password"
                                       onChange={this.onChange} name="passwordOne" value={passwordOne} type="password" required>
                                </input>
                            </div>
                            <div className="form-group input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                                </div>
                                <input id="confirm-password" className="form-control" placeholder="Repeat password"
                                       onChange={this.onChange} name="passwordTwo" value={passwordTwo} type="password" required>
                                </input>
                            </div>
                            <div className="form-group text-center">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="invalidCheck" required>
                                    </input>
                                    <label className="form-check-label" htmlFor="invalidCheck">
                                        Agree to terms and conditions
                                    </label>
                                    <div className="invalid-feedback">
                                        You must agree before submitting.
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block" id="btn-signup"> Sign Up </button>
                            </div>
                            <p className="text-center">Have an account? <a href="/login">Log In</a></p>
                        </form>
                    </article>
                </section>
            </div>
        );
    };
};

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default hot(module) (SignUp)