import React, {Component} from 'react';
import {hot} from "react-hot-loader";
import $ from 'jquery';
import {Link, withRouter} from "react-router-dom";
import * as firebase from "firebase";
import ItemsCarousel from 'react-items-carousel';
import {Spinner} from 'react-bootstrap';
import _ from 'lodash';

import {withFirebase} from "./Firebase";
import {AuthUserContext} from "./Session";
import Home from "./Home";
import * as ROUTES from "../constants/routes";
import EventModel from "./Models/EventModel";
import BrowseEvent from "./BrowseEvent";

class LandingFormBase extends Component {
    _isMounted = true;

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            activeItemIndex: 0,
        };

        $(function() {
            $('a[href*=\\#section]').on('click', function(e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
            });
        });
    }

    componentDidMount() {
        this._isMounted = true;
        const eventRef = firebase.database().ref('/events/');

        eventRef.on('value', (snapshot) => {
            // let data = _.toArray(snapshot.val());
            let data = snapshot.val();

            let events = [];

            // data.forEach( event => {
            //     console.log(event);
            //     events.push(new EventModel(event));
            // });

            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    events.push(new EventModel(key, data[key]));
                }
            }
            console.log(events);

            if (data != null && data.length !== 0) {
                this._isMounted && this.setState({ events: events});
            }
        });

    };

    componentWillUnmount() {
        this._isMounted= false;
    };

    changeActiveItem = (activeItemIndex) => this._isMounted && this.setState({ activeItemIndex });

    detailsHandler = event => {
        const key = event.target.id;
        // console.log(key);
        this.props.history.push('event/'+key);
    };

    render() {
        const {
            events,
            activeItemIndex,
        } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => !authUser ?
                    <div>
                        <section id="section01">
                            <div className="container top-pg">
                                <div className="alert alert-warning alert-dismissible fade show text-center cust-alert" role="alert">
                                    <strong>Note:</strong> This website is not responsive yet!
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="row">
                                    <div className="col text-right">
                                        <h1 className="mt-5">Register Your Event Now!</h1>

                                        <p className="top-pg-txt">
                                            MyEvent is a SIMPLE event scheduler for all types of events and for anyone to use!
                                            Suits BEST for students, companies, and clubs to organize and share their events. Take the initiative
                                            to build the most EPIC event now!
                                        </p>
                                        <br/>

                                        <Link className="btn btn-primary btn-md" id="signup" to={ROUTES.SIGN_UP}>Create Event</Link>

                                        <p className="alr-mbr-login">Already a member?
                                            <Link to={ROUTES.LOG_IN}> Log In</Link>
                                        </p>
                                    </div>
                                    <div className="col text-left mt-4 top-pg-img">
                                        <img src={require("../img/events.png")} className="img-fluid" alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div id="scroll-wrapper">
                                <a href="#section02" id="scroll"><span></span>Find Events</a>
                            </div>
                        </section>

                        <section id="section02" className="demo">
                            <div className="container scn-pg">
                                <div className="row scn-pg-title">
                                    <h3>Events Near You</h3>
                                    <Link to={ROUTES.BROWSE_EVENT} id="see-all-event">See all</Link>
                                </div>

                                <div id="event-carousel" style={{"padding":"0 60px","maxWidth":1000,"margin":"0 auto"}}>
                                    <ItemsCarousel
                                        // Placeholder configurations
                                        enablePlaceholder
                                        numberOfPlaceholderItems={3}
                                        minimumPlaceholderTime={1000}
                                        placeholderItem={
                                            <div id="event-placeholder">
                                                <Spinner id="event-placeholder-spinner" as="span" animation="grow"
                                                         size="sm" role="status" aria-hidden="true"/>
                                                Loading Event Data...
                                            </div>}

                                        // Carousel configurations
                                        numberOfCards={3}
                                        gutter={12}
                                        showSlither={true}
                                        firstAndLastGutter={false}
                                        freeScrolling={false}

                                        // Active item configurations
                                        requestToChangeActive={this.changeActiveItem}
                                        activeItemIndex={activeItemIndex}
                                        activePosition={'center'}

                                        chevronWidth={80}
                                        rightChevron={
                                            <i className="fas fa-chevron-right"/>
                                        }
                                        leftChevron={
                                            <i className="fas fa-chevron-left"/>
                                        }
                                        outsideChevron={true}
                                    >
                                        {Array.from(events).map((_, i) =>
                                            <div className="card card-event" key={i}>
                                                <img className="card-img-top card-img-event"
                                                     src="https://mdbootstrap.com/img/Photos/Horizontal/City/4-col/img%20(48).jpg"
                                                     alt="Card image cap"/>
                                                <div className="card-body">
                                                    <h4 className="card-title">{events[i].eventTitle}</h4>
                                                    <p className="card-text card-text-event text-muted display-linebreak">
                                                        <i className="fa fa-calendar"/> {events[i].getEventDateTimeStringForCard()}
                                                        <i className="fa fa-map-marker"/> {events[i].eventLocation}
                                                    </p>
                                                    <a className="btn btn-primary btn-event-details" id={events[i].eventId}
                                                       onClick={this.detailsHandler}>Details</a>
                                                </div>
                                                <div className="card-footer text-info">
                                                    {events[i].getAttendees()}
                                                </div>
                                            </div>
                                        )}
                                    </ItemsCarousel>
                                </div>

                            </div>

                            <div id="scroll-wrapper">
                                <a href="#section03" id="scroll"><span/>About Us</a>
                            </div>
                        </section>

                        <section id="section03">
                            <div className="container trd-pg">
                                <div className="row trd-pg-title">
                                    <h3>Our Features</h3>
                                </div>
                                <div className="row trd-pg-txt">
                                    <p>MyEvent provides you a flexible platform to share your events. Looking and joining
                                        events <br></br>
                                        has never been easier.</p>
                                </div>
                                <div className="row trd-pg-ftr">
                                    <div className="col">
                                        <img src={require("../img/events.png")} className="card-img-top"/>
                                        <h5 className="ft-title">Create Event</h5>
                                        <p className="ft-text">
                                            Creating and sharing event on things that you love. Enjoy the togetherness with others.
                                        </p>
                                    </div>
                                    <div className="col">
                                        <img src={require("../img/events.png")} className="card-img-top"/>
                                        <h5 className="ft-title">Browse Event</h5>
                                        <p className="ft-text">
                                            Simple event search on our website will give you the events of your choice.
                                        </p>
                                    </div>
                                    <div className="col">
                                        <img src={require("../img/events.png")} className="card-img-top"/>
                                        <h5 className="ft-title">Join Event</h5>
                                        <p className="ft-text">
                                            Quickly register yourself to the event of your choice. Meet new people, make new friends.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div id="scroll-wrapper">
                                <a href="#section04" id="scroll"><span/>Next</a>
                            </div>
                        </section>

                        <section id="section04">
                            <div className="container fourth-pg">
                                <div className="row">
                                    <div className="col-md-4">
                                        <img src={require("../img/bulb-clipart.png")} className="card-img-top"/>
                                    </div>
                                    <div className="col-md-6 ft-2-col">
                                        <h2>Experience MyEvent</h2>
                                        <h4>
                                            People created events to share their knowledge, to meet new people and make
                                            new friends, to learn from one another, and to find others with the same hobbies
                                            and interest.
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            <div id="scroll-wrapper">
                                <a href="#section05" id="scroll"><span/>More</a>
                            </div>
                        </section>

                        <section id="section05">
                            <div className="container fifth-pg">
                                <div className="row">
                                    <div className="col-md-6 ft-3-col">
                                        <h2>Initiative and Imaginative</h2>
                                        <h4>
                                            Providing the space for those who are initiative and full of imagination
                                            to organize their dream event and share with other. Experience the joy of
                                            togetherness.
                                        </h4>
                                    </div>
                                    <div className="col-md-4">
                                        <img src={require("../img/bulb-clipart.png")} className="card-img-top"/>
                                    </div>
                                </div>
                            </div>

                            <div id="scroll-wrapper">
                                <a href="#section-footer" id="scroll"><span/>Last</a>
                            </div>
                        </section>
                    </div>
                    :
                    <div>
                        <BrowseEvent />
                    </div>
                }
            </AuthUserContext.Consumer>
        );
    };
};

const Landing = () => (
    <div>
        <LandingBase/>
    </div>
);

// const condition = authUser => !authUser;

const LandingBase = withRouter(withFirebase(LandingFormBase));

export default hot(module) (withRouter(withFirebase(Landing)));
