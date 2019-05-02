import React, { Component } from "react";
import {withFirebase} from "./Firebase";
import {hot} from "react-hot-loader";
import {withRouter} from "react-router-dom";

class BrowseEventFormBase extends  Component {
    _isMounted = true;

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
}

const BrowseEvent = () => (
    <div>
        <BrowseEventBase/>
    </div>
);

const BrowseEventBase = withFirebase(BrowseEventFormBase);

export default hot(module) (withRouter(BrowseEvent));
