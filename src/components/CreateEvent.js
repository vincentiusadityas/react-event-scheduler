import $ from "jquery";
import 'jquery-ui-bundle';
import React, {Component} from 'react';
import * as firebase from "firebase";

import { withAuthorization } from './Session';
import {withFirebase} from "./Firebase";
import {withRouter} from "react-router-dom";
import { DateTimePicker } from '@syncfusion/ej2-calendars';

import '../css/CreateEvent.css'
import {eventCategories} from "../constants/event-categories";
import {hot} from "react-hot-loader";

const INITIAL_STATE = {
    eventTitle: '',
    eventDescription: '',
    eventOrganizer: '',
    eventLocation: '',
    eventStart: '',
    eventEnd: '',
    eventTicket: '',
    eventTicketQ: '',
    eventTicketP: '',
    eventPrivacy: '',
    eventCategory: 'Select a category',
    error: null,
    eventCategories: eventCategories,
};

class CreateEventFormBase extends Component {

    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };

        $(document).ready(function() {
            //jQuery time
            let current_fs, next_fs, previous_fs; //fieldsets
            let left, opacity, scale; //fieldset properties which we will animate
            let animating; //flag to prevent quick multi-click glitches

            $(".next").click(function(){
                const msform = $('#msform');
                if(msform[0].checkValidity()) {
                    if(animating) return false;
                    animating = true;

                    current_fs = $(this).parent();
                    next_fs = $(this).parent().next();

                    //activate next step on progressbar using the index of next_fs
                    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

                    //show the next fieldset
                    next_fs.show();
                    next_fs.find("input.required").attr("required", "true");

                    //hide the current fieldset with style
                    current_fs.animate({opacity: 0}, {
                        step: function(now) {
                            //as the opacity of current_fs reduces to 0 - stored in "now"
                            //1. scale current_fs down to 80%
                            scale = 1 - (1 - now) * 0.2;
                            //2. bring next_fs from the right(50%)
                            left = (now * 50)+"%";
                            //3. increase opacity of next_fs to 1 as it moves in
                            opacity = 1 - now;
                            current_fs.css({
                                'transform': 'scale('+scale+')',
                                'position': 'absolute'
                            });
                            next_fs.css({'left': left, 'opacity': opacity});
                        },
                        duration: 800,
                        complete: function(){
                            current_fs.hide();
                            current_fs.find("input.required").removeAttr("required");
                            next_fs.css({'position': 'relative'});
                            animating = false;
                        },
                        //this comes from the custom easing plugin
                        easing: 'easeInOutBack'
                    });

                } else {
                    msform[0].reportValidity();
                }
            });

            $(".previous").click(function(){
                if(animating) return false;
                animating = true;

                current_fs = $(this).parent();
                previous_fs = $(this).parent().prev();

                //de-activate current step on progressbar
                $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

                //show the previous fieldset
                previous_fs.show();
                previous_fs.find("input.required").attr("required", "true");

                //hide the current fieldset with style
                current_fs.animate({opacity: 0}, {
                    step: function(now) {
                        //as the opacity of current_fs reduces to 0 - stored in "now"
                        //1. scale previous_fs from 80% to 100%
                        scale = 0.8 + (1 - now) * 0.2;
                        //2. take current_fs to the right(50%) - from 0%
                        left = ((1-now) * 50)+"%";
                        //3. increase opacity of previous_fs to 1 as it moves in
                        opacity = 1 - now;
                        current_fs.css({'left': left});
                        previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
                    },
                    duration: 800,
                    complete: function(){
                        current_fs.hide();
                        current_fs.find("input.required").removeAttr("required");
                        previous_fs.css({'position': 'relative'});
                        animating = false;
                    },
                    //this comes from the custom easing plugin
                    easing: 'easeInOutBack'
                });
                // $("section#section-create-event").css("min-height", "100vh")
            });

            let datepicker_start = new DateTimePicker({
                format: 'dd-MMM-yy hh:mm a',
                value: new Date(),
                placeholder: 'Select a date and time',
                width: "233px"
            });
            let datepicker_end = new DateTimePicker({
                format: 'dd-MMM-yy hh:mm a',
                value: new Date(),
                placeholder: 'Select a date and time',
                width: "233px"
            });
            datepicker_start.appendTo('#datetimepicker-start');
            datepicker_end.appendTo('#datetimepicker-end');
            // datepicker_start.show("time");
            // datepicker_end.show("time");

            $.fn.currencyInput = function() {
                this.each(function() {
                    $(this).before("<span class='currency-symbol'>$</span>");
                    $(this).change(function() {
                        const min = parseFloat($(this).attr("min"));
                        const max = parseFloat($(this).attr("max"));
                        let value = this.valueAsNumber;
                        if(value < min)
                            value = min;
                        else if(value > max)
                            value = max;
                        $(this).val(value.toFixed(2));
                    });
                });
            };

            $('input#ticket-price').currencyInput();

            $("#org_name").prop("disabled", true);
            $('input:radio[name="eventOrganizer"]').change(function() {
                if ($(this).val() === 3) {
                    $("#org_name").prop("disabled", false);
                } else {
                    $("#org_name").prop("disabled", true);
                }
            });

            $("#quantity-wrapper").hide();
            $("#price-wrapper").hide();
            $('input:radio[name="eventTicket"]').change(function() {
                console.log($(this).val());
                $("#quantity-wrapper").show();
                $("#ticket-quantity").attr("required", "true");
                if ($(this).val() == 1) {
                    $("#price-wrapper").hide();
                    $("#ticket-price").removeAttr("required");
                } else {
                    $("#price-wrapper").show();
                    $("#ticket-price").attr("required", "true");
                }
            });

            // $(".submit").click(function(){
            //     return false;
            // })

        });
    };

    // componentDidMount() {
    //
    // };

    // componentWillUnmount() {
    //     firebase.database().off();
    // }

    onSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);

        // console.log(data)
        // console.log(data.entries());
        const dataDict = {};
        for(let pair of data.entries()) {
            dataDict[pair[0]] = pair[1];
        }
        // console.log(dataDict);

        this.createNewEvent(dataDict);

    };

    createNewEvent = (data) => {
        const userId = firebase.auth().currentUser.uid;
        data['creatorId'] = userId;

        const attendees = {"user": [], "guest": []};
        attendees["user"].push(userId);
        data['attendees'] = attendees;

        data['eventTicketLeft'] = data['eventTicketQ'];

        const eventRef = firebase.database().ref('/events/');
        const newEventRef = eventRef.push();

        const userRef = firebase.database().ref('/users/' + userId);
        newEventRef.set(data)
            .then(() => {
                const key = newEventRef.key;
                // console.log('key: ', key);
                const eventCreated = [key];
                userRef.update({
                    eventCreated: eventCreated,
                }).then(function() {
                    console.log("Added created event to user")
                }).catch(function(error) {
                    console.error("Adding created event to user failed: "+error)
                });
                this.props.history.push('event/'+key);

            }).catch((error) => {
                //error callback
                console.log('error: ' , error)
        });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            eventTitle,
            eventDescription,
            eventOrganizer,
            eventLocation,
            eventTicket,
            eventTicketQ,
            eventTicketP,
            eventPrivacy,
            eventCategory,
            eventCategories
        } = this.state;

        return (
            <div>
                <section id="section-create-event">
                    <form name="msform" id="msform" onSubmit={this.onSubmit}>
                        <ul id="progressbar">
                            <li className="active">Event Details</li>
                            <li>Event Details 2</li>
                            <li>Manage Tickets</li>
                            <li>Event Settings</li>
                        </ul>
                        <fieldset>
                            <h2 className="fs-title">Create your event</h2>
                            <h3 className="fs-subtitle">Provide details of your event</h3>
                            <label>Event Title</label>
                            <input type="text" name="eventTitle" placeholder="Write a simple and catchy name for your event"
                                   value={eventTitle} onChange={this.onChange} required/>
                            <label>Event Description</label>
                            <textarea name="eventDescription" placeholder="Write a complete description for your event"
                                      value={eventDescription} onChange={this.onChange} required/>
                            <label className="org_label"> Organizer name </label>
                            <div className="organizer-input">
                                <div className="col">
                                    <label className="control-label">
                                        <input type="radio" name="eventOrganizer" value="1"
                                               checked={eventOrganizer === "1"}
                                               onChange={this.onChange} required />
                                        {"  "} Myself
                                    </label>
                                    <label className="control-label">
                                        <input type="radio"  name="eventOrganizer" value="2"
                                               checked={eventOrganizer === "2"}
                                               onChange={this.onChange} />
                                        {"  "} Anonymous
                                    </label>
                                    <label className="control-label">
                                        <input type="radio" name="eventOrganizer" value="3"
                                               checked={eventOrganizer === "3"}
                                               onChange={this.onChange} disabled/>
                                        {"  "}
                                    </label>
                                    <input placeholder="type in the name" type="text" id="org_name" name="org_name"/>
                                </div>
                            </div>
                            <input type="button" name="next" className="next action-button" value="Next" />
                        </fieldset>
                        <fieldset>
                            <h2 className="fs-title">Create your event</h2>
                            <h3 className="fs-subtitle">Provide details of your event</h3>
                            <label className="org_label">Event Location</label>
                            <input className="required" type="text" name="eventLocation" placeholder="Specify your event location"
                                   value={eventLocation} onChange={this.onChange}/>
                            {/*<div className="row label-row">*/}
                                {/*<label>Event Time</label>*/}
                            {/*</div>*/}
                            <div className="row input-row">
                                <div className='col-md-6'>
                                    <div className="form-group">
                                        <div className='input-group date-input'  data-target-input="nearest">
                                            <label className="org_label">Starts</label>
                                            {/*<div className="input-group-append" data-target="#datetimepicker1"*/}
                                                 {/*data-toggle="datepicker">*/}
                                                {/*<div className="input-group-text">*/}
                                                    {/*<i className="fa fa-calendar"></i>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                                            <input type="datetime-local" className="required form-control datetimepicker-input"
                                                   id="datetimepicker-start" name="eventStart"
                                                   onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className="form-group">
                                        <div className='input-group date-input' data-target-input="nearest">
                                            <label className="org_label">Ends</label>
                                            {/*<div className="input-group-append" data-target="#datetimepicker2"*/}
                                                 {/*data-toggle="datepicker">*/}
                                                {/*<div className="input-group-text">*/}
                                                    {/*<i className="fa fa-calendar"></i>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                                            <input type="datetime-local" className="required form-control datetimepicker-input"
                                                   id="datetimepicker-end" name="eventEnd"
                                                   onChange={this.onChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*<input id="datetimepicker" type="text" />*/}
                            <input type="button" name="previous" className="previous action-button" value="Previous" />
                            <input type="button" name="next" className="next action-button" value="Next" />
                        </fieldset>
                        <fieldset>
                            <h2 className="fs-title">Tickets</h2>
                            <h3 className="fs-subtitle">Specify the tickets you want for your event</h3>
                            <div className="row ticket-input">
                                <div className="col">
                                    <label className="control-label">
                                        <input className="required" type="radio" name="eventTicket" value="1"
                                               checked={eventTicket === "1"}
                                               onChange={this.onChange} />
                                        {"  "} Free Tickets
                                    </label>
                                    <label className="control-label">
                                        <input type="radio"  name="eventTicket" value="2"
                                               checked={eventTicket === "2"}
                                               onChange={this.onChange} />
                                        {"  "} Paid Tickets
                                    </label>
                                </div>
                            </div>
                            <div className="row ticket-input" id="quantity-wrapper">
                                <label className="control-label-2">
                                    {"Quantity: "}
                                    <input id="ticket-quantity" type="number" name="eventTicketQ" min="1"
                                           value={eventTicketQ} onChange={this.onChange} />
                                </label>
                            </div>
                            <div className="row ticket-input" id="price-wrapper">
                                <label className="control-label-2">
                                    {"Price: "}
                                    <input id="ticket-price" type="number" name="eventTicketP" min="1" step="any"
                                           value={eventTicketP} onChange={this.onChange} />
                                </label>
                            </div>
                            <input type="button" name="previous" className="previous action-button" value="Previous" />
                            <input type="button" name="next" className="next action-button" value="Next" />
                        </fieldset>
                        <fieldset>
                            <h2 className="fs-title">Additional settings</h2>
                            <h3 className="fs-subtitle">Your event privacy and sharing</h3>
                            <label className="org_label"> Event Privacy </label>
                            <div className="privacy-input">
                                <div className="col">
                                    <label className="control-label">
                                        <input className="required" type="radio" name="eventPrivacy" value="1"
                                               checked={eventPrivacy === "1"}
                                               onChange={this.onChange} />
                                        {"  "} Public
                                    </label>
                                    <label className="control-label">
                                        <input type="radio"  name="eventPrivacy" value="2"
                                               checked={eventPrivacy === "2"}
                                               onChange={this.onChange} />
                                        {"  "} Private to logged in user
                                    </label>
                                    <label className="control-label">
                                        <input type="radio"  name="eventPrivacy" value="3" disabled
                                               checked={eventPrivacy === "3"}
                                               onChange={this.onChange} />
                                        {"  "} Private to specified people
                                    </label>
                                </div>
                            </div>
                            <label className="org_label"> Event Categories </label>
                            <select name="eventCategory" id="category-select"
                                    value={eventCategory} onChange={this.onChange} >
                                <option className="required" value="Select a category">Select a category</option>
                                { eventCategories.map((item, idx) => (
                                    <option key={idx} value={item}>{item}</option>
                                ))}
                            </select>
                            <input type="button" name="previous" className="previous action-button" value="Previous" />
                            <input type="submit" name="submit" className="submit action-button" value="Submit" />
                        </fieldset>
                    </form>
                </section>
            </div>
        );
    }
}

const CreateEvent = () => (
    <div>
        <CreateEventBase />
    </div>
);

const condition = authUser => !!authUser;

const CreateEventBase = withRouter(withFirebase(CreateEventFormBase));

export default hot(module) (withAuthorization(condition)(CreateEvent));
