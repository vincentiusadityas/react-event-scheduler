import React, {Component} from 'react';
import {withFirebase} from "./Firebase";
import {Link, withRouter} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import withAuthorization from "./Session/withAuthorization";
import $ from "jquery";
import { withCookies, Cookies } from 'react-cookie';
import {instanceOf} from "prop-types";

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

const Login = () => (
    <div>
        <LoginForm />
    </div>
);

class LoginFormBase extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        const { cookies } = props;
        this.state = {
            ...INITIAL_STATE,
            email: cookies.get('email') || '',
            remember: cookies.get('remember') || false
        };

        console.log(this.state.remember)
    };

    onSubmit = event => {
        const { email, password } = this.state;
        const { cookies } = this.props;

        if ($('#rememberMe').prop('checked')) {
            cookies.set('email', email, {path: '/', expires: new Date(Date.now()+1209600)});
            cookies.set('remember', true, {path: '/', expires: new Date(Date.now()+1209600)});
        } else {
            cookies.set('email', '');
            cookies.set('remember', '');
        }

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.CREATE_EVENT);
            })
            .catch(error => {
                this.setState({ error });

                // Handle Errors here.
                const errorCode = error.code.split("/");
                const errorCodeName = errorCode[1];

                let errorMessage = error.message;

                if (errorCodeName == "too-many-requests") {
                    errorMessage = "The password is invalid or the user does not have a password";
                }

                // console.log(errorCodeName + ": " + errorMessage)
                // this.props.history.push(ROUTES.LOG_IN);

                $(".error-message").html(
                    "<div class='alert alert-warning alert-dismissible fade show' id='email-used-alert' role='alert'> \
                    <strong>Error: </strong>" + errorMessage +
                    "<button type='button' class='close' data-dismiss='alert' aria-label='Close'> \
                    <span aria-hidden='true'>&times;</span> </button> \
                    </div>");
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        let { email, password, error, remember } = this.state;

        if (remember) {
            $('#rememberMe').prop('checked', true);
            console.log("remember")
        }

        return (
            <div className="bg">
                <div className="error-message">
                </div>
                <section id="section-myform">
                    <article className="card-body mx-auto">
                        <h4 className="card-title text-center">Log In</h4>
                        <p className="text-center text-hint"> Log in with your social media account or email
                            address </p>

                        <div className="social-btn text-center">
                            <a href="/login" className="btn btn-primary btn-lg"><i className="fa fa-facebook"></i> Facebook</a>
                            <a href="/login" className="btn btn-danger btn-lg"><i className="fa fa-google"></i> Google</a>
                        </div>

                        <p className="divider-text">
                            <span><b>OR</b></span>
                        </p>

                        <form onSubmit={this.onSubmit}>
                            <div className="form-group input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                                </div>
                                <input id="email" className="form-control" placeholder="Email address" name="email"
                                       onChange={this.onChange} value={email} type="email" required>
                                </input>
                            </div>
                            <div className="form-group input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                                </div>
                                <input id="password" className="form-control" placeholder="Password" type="password"
                                       name="password" onChange={this.onChange} value={password} required>
                                </input>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block" id="btn-login"> Log In
                                </button>
                            </div>
                            <div className="form-group text-center">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="rememberMe" id="rememberMe">
                                    </input>
                                    <label className="form-check-label" htmlFor="rememberMe">
                                        Remember Me
                                    </label>
                                </div>
                            </div>
                            <p className="text-center">Are you new? Register
                                <Link to={ROUTES.SIGN_UP}> here</Link>.
                            </p>
                            <p className="text-center">
                                <Link to={ROUTES.PASSWORD_FORGET}> Forgot Password?</Link>
                            </p>
                        </form>
                    </article>
                </section>
            </div>
        );
    };
};

const condition = authUser => !authUser;

const LoginForm = withRouter(withFirebase(withCookies(LoginFormBase)));

export default withAuthorization(condition)(Login)