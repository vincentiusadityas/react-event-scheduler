import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {hot} from "react-hot-loader";
import $ from "jquery";
import ReCAPTCHA from "react-google-recaptcha";

import { withFirebase } from './Firebase';
import * as ROUTES from '../constants/routes';
import withAuthorization from "./Session/withAuthorization";
import PasswordInput from "./Tool/PasswordInput";
import {Button, Modal} from "react-bootstrap";

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    phone:'',
    uniqueId:'',
    profession:'',
    description:'',
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
    _isMounted = true;
    SITE_KEY = process.env.GOOGLE_RECAPTCHA_SITE_KEY;

    constructor(props) {
        super(props);

        this.state = {
            isHuman: false,
            showReCaptchaModal: false,
            ...INITIAL_STATE
        };

        $(function() {
            $('#password, #confirm-password').on('keyup', function () {
                const confirm_password = document.getElementById("confirm-password");
                const password = document.getElementById("password");
                // console.log($('#password').val() == $('#confirm-password').val())
                if ($('#password').val() === $('#confirm-password').val()) {

                    if ($('#password-str').text() === "very weak ") {
                        password.setCustomValidity("Your password must have at least 5 characters");
                    } else if ($('#password-str').text() === "weak ") {
                        password.setCustomValidity("Your password must contain a capital letter or a number");
                    } else {
                        confirm_password.setCustomValidity("");
                    }
                } else {
                    confirm_password.setCustomValidity("Passwords Don't Match");
                }
            });
        });
    };
    
    componentDidMount() {
        this._isMounted= true;
    };

    componentWillUnmount() {
        this._isMounted= false;
    };

    onSubmit = event => {
        // console.log(this.state);

        const { firstName, lastName, email, phone, profession, description, passwordOne } = this.state;

        // console.log(email);
        // console.log(passwordOne);

        if (this.state.isHuman) {
            this.props.firebase
                .doCreateUserWithEmailAndPassword(email, passwordOne)
                .then(authUser => {
                    // Create a user in your Firebase realtime database
                    return this.props.firebase
                        .user(authUser.user.uid)
                        .set({
                            firstName,
                            lastName,
                            email,
                            phone,
                            uniqueId: authUser.user.uid.substr(0,8),
                            profession,
                            description
                        });
                })
                .then(() => {
                    return this.props.firebase.doSendEmailVerification();
                })
                .then(() => {
                    this._isMounted && this._isMounted && this.setState({ ...INITIAL_STATE });
                    this.props.history.push(ROUTES.CREATE_EVENT);
                })
                .catch(error => {
                    this._isMounted && this._isMounted && this.setState({ email: '', error });

                    // Handle Errors here.
                    const errorCode = error.code.split("/");
                    const errorCodeName = errorCode[1];

                    let errorMessage = error.message;

                    if (errorCodeName === "too-many-requests") {
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
        } else {
            this.handleReCaptchaModalShow();
        }

        event.preventDefault();
    };

    onSocialButtonClick = () => {
        alert("Social sign up is not implemented yet");
    };

    onSignInWithGoogle = event => {
        let update = false;

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
                    return this.props.firebase
                        .user(socialAuthUser.user.uid)
                        .update({
                            firstName: firstName,
                            lastName: lastName,
                        });
                }
            })
            .then(() => {
                this._isMounted && this._isMounted && this.setState({ ...INITIAL_STATE });
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

    // specifying your onload callback function
    handleReCaptcha = value => {
        // console.log(value);
        this._isMounted && this.setState({ isHuman: true })
    };

    handleReCaptchaExpired = () => {
        this._isMounted && this.setState({ isHuman: false })
    };

    handleReCaptchaModalClose = () => {
        this._isMounted && this.setState({ showReCaptchaModal: false })
    };

    handleReCaptchaModalShow = () => {
        this._isMounted && this.setState({ showReCaptchaModal: true })
    };

    render() {
        const {
            firstName,
            lastName,
            email,
            passwordOne,
            passwordTwo,
            showReCaptchaModal,
        } = this.state;

        return (
            <div>
                <Modal
                    size="sm"
                    show={showReCaptchaModal}
                    onHide={this.handleReCaptchaModalClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            ReCaptcha
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Please verify that you are a human by checking the ReCaptcha.</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleReCaptchaModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <div className="bg">
                    <div className="error-message">
                    </div>
                    <section id="section-signup-form">
                        <article className="card-body mx-auto">
                            <h4 className="card-title text-center">Create Account</h4>
                            {/*<p className="text-center text-hint"> Sign up with your social media account or email address </p>*/}

                            {/*<div className="social-btn text-center">*/}
                            {/*    <a href="/signup" onClick={this.onSocialButtonClick} className="btn btn-primary btn-lg"><i className="fa fa-facebook"/> Facebook</a>*/}
                            {/*    <a href="/signup" onClick={this.onSignInWithGoogle} className="btn btn-danger btn-lg"><i className="fa fa-google"/> Google</a>*/}
                            {/*</div>*/}

                            {/*<p className="divider-text">*/}
                            {/*    <span><b>OR</b></span>*/}
                            {/*</p>*/}

                            <p className="text-center text-hint"> Fill in your details to sign up and join us! </p>
                            <p className="divider-text">
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
                                {/*<div className="form-group input-group">*/}
                                    {/*<div className="input-group-prepend">*/}
                                        {/*<span className="input-group-text"> <i className="fa fa-lock"></i> </span>*/}
                                    {/*</div>*/}
                                    <PasswordInput
                                        id='password'
                                        value={passwordOne}
                                        placeholder='Create password'
                                        handleChanges={this.onChange}
                                    />

                                    {/*<input id="password" className="form-control" placeholder="Create password"*/}
                                           {/*onChange={this.onChange} name="passwordOne" value={passwordOne} type="password" required>*/}
                                    {/*</input>*/}

                                {/*</div>*/}
                                <div className="form-group input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                                    </div>
                                    <input id="confirm-password" className="form-control" placeholder="Repeat password"
                                           onChange={this.onChange} name="passwordTwo" value={passwordTwo} type="password" required>
                                    </input>
                                </div>
                                <ReCAPTCHA
                                    id="sign-up-recaptcha"
                                    sitekey="6Le8NaUUAAAAAGPSCfTFeDTUBi4KcdluJLLqfPMo"
                                    render="explicit"
                                    onChange = {this.handleReCaptcha}
                                    onExpired = {this.handleReCaptchaExpired}

                                />
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
                                <p className="text-center">Have an account? <Link to={ROUTES.LOG_IN}>Log In</Link></p>
                            </form>
                        </article>
                    </section>
                </div>
            </div>
        );
    };
};

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

const condition = authUser => !authUser;

export default hot(module) (withAuthorization(condition)(SignUp));
