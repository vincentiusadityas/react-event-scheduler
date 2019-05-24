import React, {Component} from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
// import Home from "../Home";

const needsEmailVerification = authUser =>
    authUser &&
    !authUser.emailVerified &&
    authUser.providerData
        .map(provider => provider.providerId)
        .includes('password');

const withEmailVerification = Component => {

    class WithEmailVerification extends React.Component {

        constructor(props) {
            super(props);

            this.state = { isSent: false };
        }

        onSendEmailVerification = () => {
            this.props.firebase
                .doSendEmailVerification()
                .then(() => this.setState({ isSent: true }));
        }

        render() {
            return (
                <div>
                    <AuthUserContext.Consumer>
                        {authUser =>
                            needsEmailVerification(authUser) ? (
                                <div>
                                    <section id="section01">
                                        <div className="container top-pg">
                                            <h1>
                                                This page is not accessible
                                            </h1>
                                            {this.state.isSent ? (
                                                <h3>
                                                    E-Mail verification sent: Check you E-Mails (Spam
                                                    folder included) for a verification E-Mail.
                                                    Refresh this page once you verified your E-Mail.
                                                </h3>
                                            ) : (
                                                <h3>
                                                    Please verify your E-Mail: Check you E-Mails (Spam folder
                                                    included) for a verification E-Mail or send
                                                    another verification E-Mail.
                                                </h3>
                                            )}

                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={this.onSendEmailVerification}
                                                disabled={this.state.isSent}
                                            >
                                                Send confirmation E-Mail
                                            </button>
                                        </div>
                                    </section>
                                </div>
                            ) : (
                                <Component {...this.props} />
                            )
                        }
                    </AuthUserContext.Consumer>
                </div>
            );
        }
    }

    return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
