import $ from "jquery";
import React, {Component} from 'react';
import * as firebase from "firebase";

import {withFirebase} from "./Firebase";
import {Link, withRouter} from "react-router-dom";
import {Badge, Button, Card, Col, Form, Jumbotron, Modal, OverlayTrigger, Popover, Row, Spinner, Tooltip} from 'react-bootstrap';

import '../css/Event.css'
import * as ROUTES from "../constants/routes";
import {hot} from "react-hot-loader";
import EventModel from  "./Models/EventModel"

class EventFormBase extends Component {
    _isMounted = true;

    constructor(props) {
        super(props);

        this.state = {
            userId: '',
            showBookingCancelModal: false,
            showBookmarkModal: false,
            showAlert: false,
            showGuestRegistration: false,
            showEmailUsed: false,
            isLoading: false,
            isLoadingGuest: false,
            isRegistered: false,
            isSoldOut: false,
            isBookmarked: false,
            event: [],
            eventDateTime: '',
            creatorName: '',
            guestFullName: '',
            guestEmail: '',
        };

        // $(document).ready(function () {
        //
        // });
    };

    componentDidMount() {
        this._isMounted= true;
        // const userId = firebase.auth().currentUser.uid;
        // let userId = firebase.auth().currentUser !== null ? firebase.auth().currentUser.uid : "";
        let userId = "";
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                userId = firebase.auth().currentUser.uid;
            }
        });

        const {eventId} = this.props.match.params;
        const eventRef = firebase.database().ref('/events/' + eventId);

        eventRef.on('value', (snapshot) => {
            let data = snapshot.val();
            // console.log(data);

            if (data != null && data.length !== 0) {
                const eventModel = new EventModel(eventId, data);

                const date = eventModel.getStartDate();
                const privacyStatus = eventModel.getPrivacyStatus();
                const ticketStatus = eventModel.getTicketStatus();
                const eventDateTime = eventModel.getEventDateTimeString();
                const numOfPeople = eventModel.getAttendees();
                this.getCreatorData(data.creatorId, data.eventOrganizer);

                if (userId !== "" ){
                    this.checkUserWithEvent(userId);
                }

                this._isMounted && this.setState({
                    userId: userId,
                    event: eventModel,
                    date: date,
                    eventStatus: privacyStatus,
                    ticketStatus: ticketStatus,
                    isSoldOut: data.eventTicketLeft <= 0,
                    eventDateTime: eventDateTime,
                    numOfPeople: numOfPeople,
                });

            } else {
                this._isMounted && this.setState({
                    event: data,
                });
            }
        });
    };

    componentWillUnmount() {
        this._isMounted= false;
    }

    onChange = event => {
        this._isMounted && this.setState({ [event.target.name]: event.target.value });
    };

    checkUserWithEvent(userId) {
        const userRef = firebase.database().ref('/users/' + userId);

        let userData = {};
        userRef.once('value').then((snapshot) => {
            userData = snapshot.val();

            const {eventId} = this.props.match.params;
            const eventRegistered = userData.bookedEvent;

            if (eventRegistered && eventRegistered.includes(eventId)) {
                this._isMounted && this.setState({
                    isRegistered: true,
                });
            }
            const eventBookmarked = userData.bookmarkedEvent;
            if (eventBookmarked && eventBookmarked.includes(eventId)) {
                this._isMounted && this.setState({
                    isBookmarked: true,
                });
            }
        });
    }

    getCreatorData(creatorId, eventOrganizer) {
        // console.log(creatorId)
        const creatorRef = firebase.database().ref('/users/' + creatorId);

        creatorRef.on('value', (snapshot) => {
            // convert messages list from snapshot
            let data = snapshot.val();
            const name = data.firstName + " " + data.lastName;
            this._isMounted && this.setState({
                creatorName: name,
            });

            const organizer = this.getEventOrganizer(eventOrganizer);
            this._isMounted && this.setState({
                organizer: organizer,
            });
        });
    }

    getEventOrganizer(data) {
        // console.log("TEST ", data == 1)
        if (data === "1") {
            return this.state.creatorName.toUpperCase();
        } else if (data === "2") {
            return "Anonymous";
        } else {
            return "";
        }
    };

    static getEventStatus(data) {
        if (data === "1") {
            return "Public";
        } else if (data === "2") {
            return "Private";
        } else {
            return "";
        }
    }

    static getTicketStatus(data) {
        if (data === "1") {
            return "Free Event";
        } else if (data === "2") {
            return "Paid Event";
        } else {
            return "";
        }
    }

    static getEventDateTimeString(start, end) {
        const split_start = start.split(" ");
        const split_end = end.split(" ");

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        const date_start = new Date(split_start[0]);
        const str_date_start = date_start.toLocaleDateString("en-US", options);
        const date_end = new Date(split_end[0]);
        const str_date_end = date_end.toLocaleDateString("en-US", options);

        const str_time_start = split_start[1] + " " + split_start[2];
        const str_time_end = split_end[1] + " " + split_end[2];

        let composed_str="";
        if (str_date_start === str_date_end) {
            composed_str =
                str_date_start + "\n" +
                str_time_start + " to " + str_time_end;
        } else {
            composed_str =
                str_date_start + "( " + str_time_start + " )" + "\n" +
                "to" + "\n" +
                str_date_end + "( " + str_time_end + " )";
        }

        return composed_str;
    }

    // static getAttendees(data) {
    //     const user = data.user ? data.user.length : 0;
    //     const guest = data.guest ? data.guest.length : 0;
    //     if ((user+guest) === 1){
    //         return "1 person is going";
    //     } else {
    //         return (user+guest) + " people are going";
    //     }
    // }

    registerUserToEvent() {
        const data = this.state.event;
        const attendees = data.attendees;
        attendees['user'].push(this.state.userId);
        const quantity = (parseInt(data.eventTicketLeft) - 1) + "";

        const {eventId} = this.props.match.params;
        const eventRef = firebase.database().ref('/events/' + eventId);
        const userRef = firebase.database().ref('/users/' + this.state.userId);

        eventRef.update({
            attendees: attendees,
            eventTicketLeft: quantity,
        }).then(function() {
            console.log("Event registered!")
        }).catch(function(error) {
            console.error("Event registration failed: "+error)
        });

        let userData = {};
        userRef.once('value').then((snapshot) => {
            userData = snapshot.val();
            this.updateUserData(userRef, eventId, userData, 'register');
        });


        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    updateUserData(userRef, eventId, data, type) {
        // console.log(data);
        let bookedEvent = [];

        if (type === 'register') {
            if (typeof  data.bookedEvent === 'undefined' || data.bookedEvent.length === 0) {
                bookedEvent.push(eventId);
            } else {
                bookedEvent = data.bookedEvent;
                bookedEvent.push(eventId);
            }
        } else if (type === 'unregister') {
            bookedEvent = data.bookedEvent;
            bookedEvent.pop(eventId);
        }

        userRef.update({
            "bookedEvent": bookedEvent,
        }).then(function() {
            console.log(type + " event from user!")
        }).catch(function(error) {
            console.error(type + " event from user failed: " + error)
        });
    }

    registerHandler = () => {
        // console.log(event.target.value);
        // const val = event.target.value;
        if (this.state.userId !== "") {
            this._isMounted && this.setState({ isLoading: true }, () => {
                this.registerUserToEvent().then(() => {
                    this.setState({
                        isLoading: false,
                        isRegistered: true
                    });
                });
            });
        } else {
            if (this.state.eventStatus === "Public") {
                this.handleGuestEventRegisterShow();
            } else if (this.state.eventStatus === "Private") {
                this.handleAlertShow();
            }
        }
    };

    unRegisterUserFromEvent() {
        const data = this.state.event;
        const attendees = data.attendees;
        attendees['user'].pop(this.state.userId);
        const quantity = (parseInt(data.eventTicketLeft) + 1) + "";

        const {eventId} = this.props.match.params;
        const eventRef = firebase.database().ref('/events/' + eventId);
        const userRef = firebase.database().ref('/users/' + this.state.userId);

        eventRef.update({
            attendees: attendees,
            eventTicketLeft: quantity,
        }).then(function() {
            console.log("Event un-registered!")
        }).catch(function(error) {
            console.error("Event cancellation failed: "+error)
        });

        let userData = {};
        userRef.once('value').then((snapshot) => {
            userData = snapshot.val();
            this.updateUserData(userRef, eventId, userData, 'unregister');
        });


        return new Promise(resolve => setTimeout(resolve, 1000));
    };

    unRegisterHandler = () => {
        if (this.state.userId !== "") {
            this._isMounted && this.setState({ isLoading: true }, () => {
                this.unRegisterUserFromEvent().then(() => {
                    this.setState({
                        isLoading: false,
                        isRegistered: false,
                        showBookingCancelModal: false,
                    });
                });
            });
        } else {
            this.handleAlertShow();
        }
    };

    bookmarkHandler = event => {

        if (this.state.userId !== "") {
            const {eventId} = this.props.match.params;
            const userRef = firebase.database().ref('/users/' + this.state.userId);

            this.setState({
                isBookmarked: true,
            });

            if (event.target.checked === false) {
                this.handleBookmarkModalShow();
            } else {
                let userData = {};
                userRef.once('value').then((snapshot) => {
                    userData = snapshot.val();
                    this.updateUserBookmarkedEvents(userRef, eventId, userData,"bookmark");
                });
            }
        } else {
            this.handleAlertShow();
        }
    };

    removeBookmarkHandler = () => {
        if (this.state.userId !== "") {
            const {eventId} = this.props.match.params;
            const userRef = firebase.database().ref('/users/' + this.state.userId);

            this.setState({
                isBookmarked: false,
            });

            let userData = {};
            userRef.once('value').then((snapshot) => {
                userData = snapshot.val();
                this.updateUserBookmarkedEvents(userRef, eventId, userData,"un-bookmark");
            });
            this.handleBookmarkModalClose();
        } else {
            this.handleAlertShow();
        }
    };

    updateUserBookmarkedEvents(userRef, eventId, data, type) {
        let bookmarkedEvent = [];

        if (type === 'bookmark') {
            if (typeof  data.bookmarkedEvent === 'undefined' || data.bookmarkedEvent.length === 0) {
                bookmarkedEvent.push(eventId);
            } else {
                bookmarkedEvent = data.bookmarkedEvent;
                bookmarkedEvent.push(eventId);
            }
        } else if (type === 'un-bookmark') {
            bookmarkedEvent = data.bookmarkedEvent;
            bookmarkedEvent.pop(eventId);
        }

        userRef.update({
            "bookmarkedEvent": bookmarkedEvent,
        }).then(function() {
            console.log(type + " success")
        }).catch(function(error) {
            console.error(type + " failed: " + error)
        });
    };

    guestEventRegistrationHandler = () => {
        const form = $('#guest-register');
        if((form)[0].checkValidity()) {

            const fullName = this.state.guestFullName.trim();
            const email = this.state.guestEmail.trim();

            const {eventId} = this.props.match.params;
            const guestData = {"fullName": fullName, "email": email, "bookedEvent": [eventId]};

            const eventRef = firebase.database().ref('/events/' + eventId);
            let eventData;

            eventRef.once('value').then((snapshot) => {
                eventData = snapshot.val();
                if (typeof eventData.attendees['guest'] === 'undefined' ||
                    !eventData.attendees['guest'].includes(email)) {
                    this._isMounted && this.setState({ isLoadingGuest: true }, () => {
                        this.registerGuestToEvent(guestData, eventId).then( () => {
                            this.setState({
                                isLoadingGuest: false,
                                showGuestRegistration: false,
                            });
                        })
                    });
                } else {
                    this._isMounted && this.setState({ showEmailUsed: true });
                }
            });
            // console.log(fullName, " ", email);
            // form.submit();
        } else {
            form[0].reportValidity();
        }
    };

    registerGuestToEvent(guestData, eventId) {

        const guestRef = firebase.database().ref('/guests/');
        const newGuestRef = guestRef.child(guestData.email);
        // console.log(newGuestRef);

        const eventRef = firebase.database().ref('/events/' + eventId);

        newGuestRef.set(guestData)
            .then(() => {
                // console.log(newGuestRef.key); //same as guestData.email
                const key = guestData.email;

                const eventData = this.state.event;
                const attendees = eventData.attendees;

                if (typeof attendees['guest'] === 'undefined') {
                    attendees['guest'] = [key];
                } else {
                    attendees['guest'].push(key);
                }

                eventRef.update({
                    attendees: attendees,
                }).then(function() {
                    console.log("Guest is registered to event")
                }).catch(function(error) {
                    console.error("Registering guest to event failed: " + error)
                });

            }).catch((error) => {
            //error callback
            console.log('error: ' , error)
        });

        return new Promise(resolve => setTimeout(resolve, 1000));
    };

    handleBookmarkModalClose = () => {
        this._isMounted && this.setState({ showBookmarkModal: false });
    };

    handleBookmarkModalShow = () => {
        this._isMounted && this.setState({ showBookmarkModal: true });
    };

    handleBookingModalClose = () => {
        this._isMounted && this.setState({ showBookingCancelModal: false });
    };

    handleBookingModalShow = () => {
        this._isMounted && this.setState({ showBookingCancelModal: true });
    };

    handleAlertClose = () => {
        this._isMounted && this.setState({showAlert: false});
    };

    handleAlertShow = () => {
        this._isMounted && this.setState( { showAlert: true });
    };

    handleGuestEventRegisterClose = () => {
        this._isMounted && this.setState( { showGuestRegistration: false, isLoadingGuest: false });
    };

    handleGuestEventRegisterShow = () => {
        this._isMounted && this.setState( { showGuestRegistration: true });
    };

    render() {
        const {
            event,
            date,
            organizer,
            eventStatus,
            ticketStatus,
            eventDateTime,
            numOfPeople,
            isLoading,
            isLoadingGuest,
            isRegistered,
            isBookmarked,
            showBookingCancelModal,
            showBookmarkModal,
            showAlert,
            showGuestRegistration,
            showEmailUsed,
            isSoldOut,
            guestFullName,
            guestEmail,
        } = this.state;

        return (
            <div>
                <Modal show={showGuestRegistration} onHide={this.handleGuestEventRegisterClose} backdrop={isLoadingGuest? "static" : true}>
                    <Modal.Header closeButton>
                            <Modal.Title>
                                Guest Registration
                            </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="display-linebreak">
                        <Form id="guest-register">
                            <Form.Group as={Row} controlId="guestFullName">
                                <Form.Label column sm={4}>
                                    Full Name
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" placeholder="Full Name" value={guestFullName}
                                                  name="guestFullName" onChange={this.onChange}
                                                  disabled={isLoadingGuest} required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="guestEmail">
                                <Form.Label column sm={4}>
                                    Email
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="email" placeholder="Email" value={guestEmail}
                                                  name="guestEmail" onChange={this.onChange}
                                                  disabled={isLoadingGuest} required/>
                                    <div id="validation-item-custom-email-used" className="validation-advice"
                                         hidden={!showEmailUsed}>
                                        This email address is already registered to this event.
                                    </div>
                                </Col>
                            </Form.Group>
                            <Form.Group controlId="getEmailCheckbox">
                                <Form.Check type="checkbox" label="Email me on event notifications"
                                            disabled={isLoadingGuest}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <OverlayTrigger
                            trigger="click"
                            placement="top"
                            overlay={
                                <Popover id="popover-basic" title="Registration">
                                    This registration is only for this event. Other events might require user
                                    to be logged in. For easier registration, you can
                                    <Link to={ROUTES.SIGN_UP}> sign up</Link> or <Link to={ROUTES.SIGN_UP}>log in</Link> now.
                                </Popover>
                            }
                        >
                            <span id="click-me"><i className="fas fa-exclamation-circle"/> Click me</span>
                        </OverlayTrigger>
                        <Button variant="secondary" onClick={this.handleGuestEventRegisterClose} disabled={isLoadingGuest}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" onClick={this.guestEventRegistrationHandler} disabled={isLoadingGuest}>
                            {isLoadingGuest ?
                                <div>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> <span> Registering </span>
                                </div>
                                :
                                <div>Register As Guest</div>
                            }
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showAlert} onHide={this.handleAlertClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>User not logged in</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="display-linebreak">
                        <p>
                            {'\n'}You are currently not logged in!{'\n'}
                            Please log in first to be able to register or bookmark this event.
                        </p>
                        <br/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleAlertClose}>
                            Close
                        </Button>
                        <Link to={ROUTES.LOG_IN}>
                            <Button variant="primary">
                                Login Now
                            </Button>
                        </Link>
                    </Modal.Footer>
                </Modal>

                <Modal show={showBookmarkModal} onHide={this.handleBookmarkModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Booking Cancellation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="display-linebreak">
                        <p>
                            {'\n'}Are you sure to remove bookmark from this event?{'\n'}
                            Your will not get notifications on event changes.
                        </p>
                        <br/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleBookmarkModalClose}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={this.removeBookmarkHandler} >
                            Remove Bookmark
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showBookingCancelModal} onHide={this.handleBookingModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Booking Cancellation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="display-linebreak">
                        <p>
                            {'\n'}Are you sure to cancel this booking?{'\n'}
                            Your spot will not be saved and can be taken by others.{'\n'}
                            <b>PS: Tickets bought are not refundable.</b>
                        </p>
                        <br/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleBookingModalClose}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={this.unRegisterHandler}>
                            Cancel Booking
                        </Button>
                    </Modal.Footer>
                </Modal>
                {event == null || event.length === 0 ?
                    <section id="section-event">
                        <div className="container top-pg-error">
                            <h1>Error</h1>
                            <p>Sorry, but the event you look does not exist :(</p>
                        </div>
                    </section>
                    :
                    <section id="section-event">
                        <Jumbotron className="top-pg-event">
                            <Row>
                                <Col md={3} id="event-img">
                                    <img src={require("../img/events.png")} className="img-fluid" alt=""/>
                                </Col>
                                <Col md={5}>
                                    <h4><i className="fa fa-calendar"/> {date}</h4>
                                    <h2 id="event-title">{event.eventTitle}</h2>
                                    <p id="by-org">Hosted by {organizer}</p>
                                </Col>
                                <Col md={4}>
                                    {!isRegistered ?
                                        <h5 id="going-heading">Are you going? <i id="num-of-people"> {numOfPeople} </i></h5>
                                        :
                                        <h5 id="going-heading">You are going! <i id="num-of-people"> {numOfPeople} with you </i></h5>
                                    }
                                    <Row>
                                        <Col md={5}>
                                            {!isRegistered ?
                                                <Button className="btn-register" id="btn-register" variant={isSoldOut ? "warning" : "primary"}
                                                        disabled={isLoading || isSoldOut} onClick={!isLoading ? this.registerHandler : null}>
                                                    {
                                                        !isLoading && isSoldOut ? 'Sold Out!'
                                                        : !isLoading ? 'Register'
                                                        : 'Loading...'
                                                    }
                                                </Button>
                                                :
                                                <Button className="btn-register" id="btn-register" variant="danger"
                                                        disabled={isLoading} onClick={this.handleBookingModalShow}>
                                                    {isLoading ? 'Loading…' : 'Cancel Booking'}
                                                </Button>
                                            }

                                        </Col>
                                        <Col md={7}>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-bookmark">
                                                        By bookmarking this event, you will get notifications on event changes.
                                                    </Tooltip>
                                                }
                                            >
                                                <label htmlFor="bookmark-event" className="custom-checkbox">
                                                    <input type="checkbox" id="bookmark-event" onChange={this.bookmarkHandler} checked={isBookmarked}/>
                                                    <i className="far fa-heart"/>
                                                    <i className="fas fa-heart"/>
                                                    <span id="bookmark-text">Save Event</span>
                                                </label>
                                            </OverlayTrigger>
                                        </Col>
                                    </Row>
                                    <hr/>
                                    {/*<p>{ticketStatus} |  {event.eventTicketLeft <= 0 ? 'Tickets sold out!' : 'Quantity: ' + event.eventTicketLeft}</p>*/}
                                    <Badge pill variant="success">
                                        {eventStatus}
                                    </Badge>
                                    {" "}
                                    <Badge pill variant="success">
                                        {ticketStatus}
                                    </Badge>
                                    {" "}
                                    <Badge pill variant="success">
                                        {event.eventTicketLeft <= 0 ? 'Tickets sold out!' : event.eventTicketLeft + ' spots left!'}
                                    </Badge>
                                    {" "}
                                    {event["eventTicketP"] !== "" ?
                                        <Badge pill variant="success">
                                            Price: {event["eventTicketP"]}
                                        </Badge>
                                        :
                                        <div/>
                                    }
                                </Col>
                            </Row>
                            <hr/>
                            <Row>
                                <Col md={8}>
                                    <div id="description-wrapper">
                                        <h5 id="description-heading">Description</h5>
                                        <p id="event-description">
                                            {event.eventDescription}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <Card style={{ width: '18rem' }}>
                                        <Card.Body>
                                            <Card.Title><i className="fa fa-clock"/> Date and Time</Card.Title>
                                            <hr/>
                                            <Card.Text className="display-linebreak">
                                                {eventDateTime}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Body>
                                            <Card.Title><i className="fa fa-map-marker"/> Location</Card.Title>
                                            <hr/>
                                            <Card.Text className="display-linebreak">
                                                {event.eventLocation}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Body>
                                            <Card.Title><i className="fa fa-tag"/> Tags</Card.Title>
                                            <hr/>
                                            <Card.Text className="display-linebreak">
                                                <Badge pill variant="info">
                                                    {event.eventCategory}
                                                </Badge>
                                            </Card.Text>
                                        </Card.Body>

                                    </Card>
                                </Col>
                            </Row>
                        </Jumbotron>
                    </section>
                }

            </div>
        )
    };
}

const Event = () => (
    <div>
        <EventBase/>
    </div>
);

// const condition = authUser => !authUser;

const EventBase = withRouter(withFirebase(EventFormBase));

// export default withAuthorization(condition)(Event);
export default hot(module) (Event);
