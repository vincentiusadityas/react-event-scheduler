import React from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        _isMounted = false;

        constructor(props) {
            super(props);

            this.state = {
                authUser: null,
            };
        }

        componentDidMount() {
            this._isMounted = true;

            this.listener = this.props.firebase.auth.onAuthStateChanged (
                authUser => {
                    authUser && this._isMounted
                        ? this.setState({authUser})
                        : this.setState({authUser: null});
                });
            // console.log(this.state.authUser);
        }

        componentWillUnmount() {
            this._isMounted = false;

            if (this._isMounted) this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(WithAuthentication);
};

export default withAuthentication;