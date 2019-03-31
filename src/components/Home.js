import React, {Component} from 'react';
import {hot} from "react-hot-loader";
import $ from 'jquery';

class Home extends Component {

    constructor(props, context) {
        super(props, context);

        $(function() {
            $('a[href*=\\#section]').on('click', function(e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
            });

            // $('#login', '#signup').onclick(function(e) {
            //     e.preventDefault();
            //     window.location.refresh();
            // });
        });
    }

    render() {
        return (
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
                                    The logo in the navbar is now a default Bootstrap feature in Bootstrap 4! Make sure to
                                    set
                                    the
                                    width
                                    and height of the logo within the HTML or with CSS. For best results, use an SVG image
                                    as
                                    your
                                    logo.
                                </p>

                                <a href="/signup" className="btn btn-primary btn-lg" id="create-event">Create Event</a>

                                <p className="alr-mbr-login">Already a member?
                                    <a href="/login">Log in</a>
                                </p>
                            </div>
                            <div className="col text-left mt-4 top-pg-img">
                                <img src={require("../img/events.png")} className="img-fluid" alt=""></img>
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
                            <a href="#" id="see-all-event">See all</a>
                        </div>

                        <div className="row justify-content-center">
                            <div id="events-nearby-carousel" className="carousel slide" data-ride="carousel"
                                 data-interval="false">

                                <div className="carousel-inner" role="listbox">

                                    <div className="carousel-item active">
                                        <div className="row justify-content-center">
                                            <div className="col-sm-3">
                                                <div className="card">
                                                    <img className="card-img-top"
                                                         src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg"
                                                         alt="Card image cap"></img>
                                                    <div className="card-body">
                                                        <h4 className="card-title">Card title</h4>
                                                        <p className="card-text">Some quick example text to build on the card
                                                            title
                                                            and
                                                            make up the bulk of the
                                                            card's content.</p>
                                                        <a className="btn btn-primary">Button</a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-3">
                                                <div className="card">
                                                    <img className="card-img-top"
                                                         src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(18).jpg"
                                                         alt="Card image cap"></img>
                                                    <div className="card-body">
                                                        <h4 className="card-title">Card title</h4>
                                                        <p className="card-text">Some quick example text to build on the card
                                                            title
                                                            and
                                                            make up the bulk of the
                                                            card's content.</p>
                                                        <a className="btn btn-primary">Button</a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-3">
                                                <div className="card">
                                                    <img className="card-img-top"
                                                         src="https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(35).jpg"
                                                         alt="Card image cap"></img>
                                                    <div className="card-body">
                                                        <h4 className="card-title">Card title</h4>
                                                        <p className="card-text">Some quick example text to build on the card
                                                            title
                                                            and
                                                            make up the bulk of the
                                                            card's content.</p>
                                                        <a className="btn btn-primary">Button</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="carousel-item">
                                        <div className="row justify-content-center">
                                            <div className="col-sm-3">
                                                <div className="card">
                                                    <img className="card-img-top"
                                                         src="https://mdbootstrap.com/img/Photos/Horizontal/City/4-col/img%20(60).jpg"
                                                         alt="Card image cap"></img>
                                                    <div className="card-body">
                                                        <h4 className="card-title">Card title</h4>
                                                        <p className="card-text">Some quick example text to build on the card
                                                            title
                                                            and
                                                            make up the bulk of the
                                                            card's content.</p>
                                                        <a className="btn btn-primary">Button</a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-3">
                                                <div className="card">
                                                    <img className="card-img-top"
                                                         src="https://mdbootstrap.com/img/Photos/Horizontal/City/4-col/img%20(47).jpg"
                                                         alt="Card image cap"></img>
                                                    <div className="card-body">
                                                        <h4 className="card-title">Card title</h4>
                                                        <p className="card-text">Some quick example text to build on the card
                                                            title
                                                            and
                                                            make up the bulk of the
                                                            card's content.</p>
                                                        <a className="btn btn-primary">Button</a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-3">
                                                <div className="card">
                                                    <img className="card-img-top"
                                                         src="https://mdbootstrap.com/img/Photos/Horizontal/City/4-col/img%20(48).jpg"
                                                         alt="Card image cap"></img>
                                                    <div className="card-body">
                                                        <h4 className="card-title">Card title</h4>
                                                        <p className="card-text">Some quick example text to build on the card
                                                            title
                                                            and
                                                            make up the bulk of the
                                                            card's content.</p>
                                                        <a className="btn btn-primary">Button</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <a className="carousel-control-prev" href="#events-nearby-carousel" role="button"
                                   data-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#events-nearby-carousel" role="button"
                                   data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>
                        </div>

                    </div>

                    <div id="scroll-wrapper">
                        <a href="#section03" id="scroll"><span></span>About Us</a>
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
                                <img src={require("../img/events.png")} className="card-img-top"></img>
                                <h5 className="ft-title">Card title</h5>
                                <p className="ft-text">Some quick example text to build on the card title
                                    and make up the
                                    bulk
                                    of the card's content.</p>
                            </div>
                            <div className="col">
                                <img src={require("../img/events.png")} className="card-img-top"></img>
                                <h5 className="ft-title">Card title</h5>
                                <p className="ft-text">Some quick example text to build on the card title
                                    and make up the
                                    bulk
                                    of the card's content.</p>
                            </div>
                            <div className="col">
                                <img src={require("../img/events.png")} className="card-img-top"></img>
                                <h5 className="ft-title">Card title</h5>
                                <p className="ft-text">Some quick example text to build on the card title
                                    and make up the
                                    bulk
                                    of the card's content.</p>
                            </div>
                        </div>
                    </div>

                    <div id="scroll-wrapper">
                        <a href="#section04" id="scroll"><span></span>Next</a>
                    </div>
                </section>

                <section id="section04">
                    <div className="container fourth-pg">
                        <div className="row">
                            <div className="col-md-4">
                                <img src={require("../img/bulb-clipart.png")} className="card-img-top"></img>
                            </div>
                            <div className="col-md-6 ft-2-col">
                                <h2>Sub-title</h2>
                                <h4>Some quick example text to build on the card title
                                    and make up the
                                    bulk
                                    of the card's content.</h4>
                            </div>
                        </div>
                    </div>

                    <div id="scroll-wrapper">
                        <a href="#section05" id="scroll"><span></span>More</a>
                    </div>
                </section>

                <section id="section05">
                    <div className="container fifth-pg">
                        <div className="row">
                            <div className="col-md-6 ft-3-col">
                                <h2>Sub-title</h2>
                                <h4>Some quick example text to build on the card title
                                    and make up the
                                    bulk
                                    of the card's content.</h4>
                            </div>
                            <div className="col-md-4">
                                <img src={require("../img/bulb-clipart.png")} className="card-img-top"></img>
                            </div>
                        </div>
                    </div>

                    <div id="scroll-wrapper">
                        <a href="#section-footer" id="scroll"><span></span>Last</a>
                    </div>
                </section>
            </div>
        );
    };
};

export default hot(module) (Home);