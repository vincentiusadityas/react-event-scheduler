import React, { Component } from "react";
import * as firebase from "firebase";
import {hot} from "react-hot-loader";
import {withRouter} from "react-router-dom";
import {Button, Card, Col, Dropdown, ListGroup, Row, Tab} from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';

import '../css/BrowseEvent.css'
import {withFirebase} from "./Firebase";
import EventModel from "./Models/EventModel";
import {eventCategories} from "../constants/event-categories";

class BrowseEventFormBase extends  Component {
    _isMounted = true;

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            filtered_events: [],
            suggestions: [],
            titles: [],
            keyword: '',
            value:'',
            eventCategoryInit: 'Select a category',
            eventCategories: eventCategories,
        };
    }

    componentDidMount() {
        this._isMounted = true;

        const eventRef = firebase.database().ref('/events/');

        eventRef.on('value', (snapshot) => {
            // let data = _.toArray(snapshot.val());
            let data = snapshot.val();

            let events = [];
            let titles = [];

            // data.forEach( event => {
            //     console.log(event);
            //     events.push(new EventModel(event));
            // });

            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    events.push(new EventModel(key, data[key]));
                    titles.push({name: data[key].eventTitle});
                }
            }
            // console.log(titles);
            // console.log(events);

            if (data != null && data.length !== 0) {
                this._isMounted && this.setState({
                    events: events,
                    filtered_events: events,
                    titles: titles,
                });
            }
        });
    };

    componentWillUnmount() {
        this._isMounted = false;
    };

    onChange = event => {
        this._isMounted && this.setState({ [event.target.name]: event.target.value });
    };

    handleSearch = event => {
        event.preventDefault();
        const data = new FormData(event.target);

        const searchFilters = {};
        for(let pair of data.entries()) {
            searchFilters[pair[0]] = pair[1];
        }
        // console.log(searchFilters);

        let updatedList = this.state.events;
        updatedList = updatedList.filter(function(item){
            return item.eventTitle.toLowerCase().search(
                searchFilters['keyword'].toLowerCase()) !== -1;
        });

        if (searchFilters['eventCategoryInit'] !== "Select a category") {
            updatedList = updatedList.filter(function(item){
                return item.eventCategory.search(
                    searchFilters['eventCategoryInit']) !== -1;
            });
        }

        this._isMounted && this.setState({filtered_events: updatedList});
    };

    detailsHandler = event => {
        const key = event.target.id;
        const data = event.target.value.split(',');
        // console.log("DATA ", data[0]);
        this.props.history.push({
            pathname: 'event/'+key,
            state: {
                creatorId: data[0],
                eventOrganizer: data[1],
            }
        });
    };

    // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
    escapeRegexCharacters(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getSuggestions = value => {
        const escapedValue = this.escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
            return [];
        }

        const regex = new RegExp('^' + escapedValue, 'i');

        return this.state.titles.filter(title => regex.test(title.name));
    };

    // When suggestion is clicked, Autosuggest needs to populate the input
    // based on the clicked suggestion. Teach Autosuggest how to calculate the
    // input value for every given suggestion.
    getSuggestionValue = suggestion => suggestion.name;

    // Use your imagination to render suggestions.
    renderSuggestion = suggestion => (
        <div>
            <span>{suggestion.name}</span>
            <span> {""} </span>
        </div>
    );

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onChangeSuggestion = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    render() {
        // const {test} = this.state;
        const {
            keyword,
            value,
            suggestions,
            filtered_events,
            eventCategoryInit,
            eventCategories,
        } = this.state;

        const inputProps = {
            keyword: keyword,
            placeholder: "Enter event name",
            name: "keyword",
            value,
            onChange: this.onChangeSuggestion,
            className: "form-control search-slt"
        };

        return (
            <div>
                <section id="section-search-bg">

                </section>

                <section id="section-search">
                    <div className="container search-box">
                        <h2 id="search-box-title">EXPLORE EVENTS</h2>
                        <h5 id="search-box-sub-title"> Find the things you love and do it with others </h5>
                        <form noValidate="novalidate" onSubmit={this.handleSearch}>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="row">
                                        <div className="col-lg-7 col-md-7 col-sm-12 p-0">
                                            {/*<input type="text" className="form-control search-slt" value={keyword} name="keyword"*/}
                                            {/*id="keyword" onChange={this.onChange} placeholder="Enter event name"/>*/}
                                            <Autosuggest
                                                suggestions={suggestions}
                                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                getSuggestionValue={this.getSuggestionValue}
                                                renderSuggestion={this.renderSuggestion}
                                                inputProps={inputProps}
                                            />
                                        </div>
                                        <div className="col-lg-3 col-md-3 col-sm-12 p-0">
                                            <select name="eventCategoryInit" id="category-select" className="form-control search-slt"
                                                    value={eventCategoryInit} onChange={this.onChange} >
                                                <option className="required" value="Select a category">Select a category</option>
                                                { eventCategories.map((item, idx) => (
                                                    <option key={idx} value={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-2 col-md-2 col-sm-12 p-0">
                                            <button type="submit" className="btn btn-danger wrn-btn">Search</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Col xs={4} sm={6} md={5}>
                                <ListGroup id="event-list" variant="pills" className="flex-column">
                                    { filtered_events.length > 0 ?
                                        filtered_events.map((item, idx) => (
                                        <ListGroup.Item action variant="info" key={idx} eventKey={filtered_events[idx].eventId}>
                                            {filtered_events[idx].eventTitle}
                                        </ListGroup.Item>
                                        ))
                                        :
                                        <div>
                                            No event matches your search :(
                                        </div>
                                    }
                                </ListGroup>
                            </Col>
                            <Col xs={8} sm={6} md={7}>
                                <Tab.Content id="event-content">
                                    { filtered_events.map((item, idx) => (
                                        <Tab.Pane key={idx} eventKey={filtered_events[idx].eventId}>
                                            <Card>
                                                <Card.Header>{filtered_events[idx].getEventStartTimeForCard()}</Card.Header>
                                                <Card.Body bsPrefix="card-body card-body-event">
                                                    <Row>
                                                        <Col md={4}>
                                                            <img src={require("../img/events.png")} className="img-fluid" alt=""/>
                                                        </Col>
                                                        <Col md={8}>
                                                            <Card.Title>{filtered_events[idx].eventTitle}</Card.Title>
                                                            <Card.Text>
                                                                {filtered_events[idx].eventDescription}
                                                            </Card.Text>
                                                            <br/>
                                                            <Button variant="primary" id={filtered_events[idx].eventId}
                                                                    value={
                                                                        [
                                                                            filtered_events[idx].creatorId,
                                                                            filtered_events[idx].eventOrganizer,
                                                                        ]
                                                                    }
                                                                    onClick={this.detailsHandler}>Details</Button>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Tab.Pane>
                                    ))}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </section>
            </div>
        )
    }
}

const BrowseEvent = () => (
    <div>
        <BrowseEventBase/>
    </div>
);

const BrowseEventBase = withRouter(withFirebase(BrowseEventFormBase));

export default hot(module) (withRouter(withFirebase(BrowseEvent)));
