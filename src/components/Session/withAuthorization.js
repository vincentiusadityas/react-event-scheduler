import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        _isMounted = false;

        componentDidMount() {
            this._isMounted = true;

            this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
                if (!condition(authUser) && this._isMounted) {
                    this.props.history.push(ROUTES.LOG_IN);
                }
            });
        }

        componentWillUnmount() {

            this._isMounted = false;
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ? <Component {...this.props} /> : null
                    }
                </AuthUserContext.Consumer>
            );
        }
    }

    return compose(
        withRouter,
        withFirebase,
    )(WithAuthorization);
};

export default withAuthorization;