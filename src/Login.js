import React from 'react';
import {hot} from "react-hot-loader";

const Login = () => {
    return (
        <div className="bg">
            <section id="section-myform">
                <article className="card-body mx-auto">
                    <h4 className="card-title text-center">Log In</h4>
                    <p className="text-center text-hint"> Log in with your social media account or email
                        address </p>

                    <div className="social-btn text-center">
                        <a href="#" className="btn btn-primary btn-lg"><i
                            className="fa fa-facebook"></i> Facebook</a>
                        <a href="#" className="btn btn-danger btn-lg"><i className="fa fa-google"></i> Google</a>
                    </div>

                    <p className="divider-text">
                        <span><b>OR</b></span>
                    </p>

                    <form>
                        <div className="form-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                            </div>
                            <input name="" className="form-control" placeholder="Email address" type="email"
                                   required></input>
                        </div>
                        <div className="form-group input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                            </div>
                            <input id="password" className="form-control" placeholder="Password" type="password"
                                   required></input>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block" id="btn-login"> Log In
                            </button>
                        </div>
                        <p className="text-center">Are you new? Register <a href="signup.html">here</a>. </p>
                    </form>
                </article>
            </section>
        </div>
    );
};

export default hot(module) (Login)