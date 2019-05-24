import React, {Component} from 'react';
import {withFirebase} from "./Firebase";
import {Link, withRouter} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import withAuthorization from "./Session/withAuthorization";
import $ from "jquery";
import { withCookies, Cookies } from 'react-cookie';
import {instanceOf} from "prop-types";
import {hot} from "react-hot-loader";

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
    _isMounted = true;

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

        // console.log(this.state.remember)
    };

    componentDidMount() {
        this._isMounted= true;
    };

    componentWillUnmount() {
        this._isMounted= false;
    }

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
                this._isMounted && this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.BROWSE_EVENT);
            })
            .catch(error => {
                this._isMounted && this.setState({ error });

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

    onSignInWithFacebook = event => {
        let update = false;
        if ($('#updateData').prop('checked')) {
            update = true;
        }

        this.props.firebase
            .doSignInWithFacebook()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too

                const name = socialAuthUser.additionalUserInfo.profile.name;
                const nameArr = name.split(" ");
                let firstName = "";
                let lastName = "";
                if (nameArr.length === 1) {
                    firstName = nameArr[0];
                } else {
                    lastName = nameArr[nameArr.length-1];
                    firstName = name.substring(0, name.length-lastName.length-1);
                }

                if (socialAuthUser.additionalUserInfo.isNewUser) {
                    return this.props.firebase
                        .user(socialAuthUser.user.uid)
                        .set({
                            firstName: firstName,
                            lastName: lastName,
                            email: socialAuthUser.additionalUserInfo.profile.email,
                            phone: "",
                            uniqueId: socialAuthUser.user.uid.substr(0,8),
                            profession: "",
                            description: "",
                        });
                } else {
                    return update && this.props.firebase
                        .user(socialAuthUser.user.uid)
                        .update({
                            firstName: firstName,
                            lastName: lastName,
                        });
                }
            })
            .then(() => {
                this._isMounted && this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.BROWSE_EVENT);
            })
            .catch(error => {
                this._isMounted && this.setState({ error });
                const errorMessage = "An account with an E-Mail address to\n" +
                    "  this social account already exists. Try to login with\n" +
                    "  your Google account or type in your email and password instead.";
                $(".error-message").html(
                    "<div class='alert alert-warning alert-dismissible fade show' id='email-used-alert' role='alert'> \
                    <strong>Error: </strong>" + errorMessage +
                    "<button type='button' class='close' data-dismiss='alert' aria-label='Close'> \
                    <span aria-hidden='true'>&times;</span> </button> \
                    </div>");
            });

        event.preventDefault();
    };

    onSignInWithGoogle = event => {
        let update = false;
        if ($('#updateData').prop('checked')) {
            update = true;
        }

        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                // console.log(socialAuthUser.user.displayName);
                // console.log(socialAuthUser.user.email);
                const name = socialAuthUser.user.displayName;
                const nameArr = name.split(" ");
                let firstName = "";
                let lastName = "";
                if (nameArr.length === 1) {
                    firstName = nameArr[0];
                } else {
                    lastName = nameArr[nameArr.length-1];
                    firstName = name.substring(0, name.length-lastName.length-1);
                }

                if (socialAuthUser.additionalUserInfo.isNewUser) {
                    return this.props.firebase
                        .user(socialAuthUser.user.uid)
                        .set({
                            firstName: firstName,
                            lastName: lastName,
                            email: socialAuthUser.user.email,
                            phone: "",
                            uniqueId: socialAuthUser.user.uid.substr(0,8),
                            profession: "",
                            description: "",
                        });
                } else {
                    return update && this.props.firebase
                        .user(socialAuthUser.user.uid)
                        .update({
                            firstName: firstName,
                            lastName: lastName,
                        });
                }
            })
            .then(() => {
                this._isMounted && this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.BROWSE_EVENT);
            })
            .catch(error => {
                this._isMounted && this.setState({ error });
            });
        event.preventDefault();
    };

    onChange = event => {
        this._isMounted && this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        let { email, password, error, remember } = this.state;

        if (remember) {
            $('#rememberMe').prop('checked', true);
        }

        return (
            <div className="bg">
                <div className="error-message">
                </div>
                <section id="section-login-form">
                    <article className="card-body mx-auto">
                        <h4 className="card-title text-center">Log In</h4>
                        <p className="text-center text-hint"> Log in with your social media account or email
                            address </p>
                        <div className="update-data text-center">
                            <input className="form-check-input" type="checkbox" name="updateData" id="updateData">
                            </input>
                            <label className="form-check-label" htmlFor="updateData">
                                Update my data from my social media
                            </label>
                        </div>
                        <div className="social-btn text-center">
                            <a href="/login" onClick={this.onSignInWithFacebook} className="btn btn-primary btn-lg"><i className="fa fa-facebook"/> Facebook</a>
                            <a href="/login" onClick={this.onSignInWithGoogle} className="btn btn-danger btn-lg"><i className="fa fa-google"/> Google</a>
                        </div>

                        <p className="divider-text">
                            <span><b>OR</b></span>
                        </p>

                        <form onSubmit={this.onSubmit}>
                            <div className="form-group input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-envelope"/> </span>
                                </div>
                                <input id="email" className="form-control" placeholder="Email address" name="email"
                                       onChange={this.onChange} value={email} type="email" required>
                                </input>
                            </div>
                            <div className="form-group input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"> <i className="fa fa-lock"/> </span>
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

export default hot(module) (withAuthorization(condition)(Login));
