import React, {Component} from 'react';
import { withAuthorization } from './Session';
import {withFirebase} from "./Firebase";
import {withRouter} from "react-router-dom";
import {hot} from "react-hot-loader";

class HomeFormBase extends Component {

    constructor(props) {
        super(props);
    };

    componentDidMount() {
    };

    componentWillUnmount() {
    };

    render() {
        return (
            <div>
                <section id="section01">
                    <div className="container top-pg">
                        <h1>Home Page</h1>
                        <p>The Home Page is accessible by every signed in user.</p>
                        <p>This page is not yet available for usage, please navigate to other page!</p>
                    </div>
                </section>
            </div>
        )
    }
}

const Home = () => (
    <div>
        <HomeBase />
    </div>
);

const condition = authUser => !!authUser;

const HomeBase = withRouter(withFirebase(HomeFormBase));

// export default compose(
//     withAuthorization(condition),
//     withRouter,
//     withFirebase,
// )(Home);

export default hot(module) (withAuthorization(condition)(Home));
