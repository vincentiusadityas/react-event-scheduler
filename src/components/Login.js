import React, {Component} from 'react';
import {hot} from "react-hot-loader";
import {withFirebase} from "./Firebase";
import {withRouter} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import withAuthorization from "./Session/withAuthorization";

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

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    };

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
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
        const { email, password, error } = this.state;

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
                                <input className="form-control" placeholder="Email address" name="email"
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
                            <p className="text-center">Are you new? Register <a href="/signup">here</a>. </p>
                        </form>
                    </article>
                </section>
            </div>
        );
    };
};

const condition = authUser => !authUser;

const LoginForm = withRouter(withFirebase(LoginFormBase));

export default withAuthorization(condition)(Login)