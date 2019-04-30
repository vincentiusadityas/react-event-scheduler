import React from 'react';
import {hot} from "react-hot-loader";
import * as ROUTES from "../constants/routes";

const Footer = () => {
    return (
        <div>
            <section id="section-footer">
                <div className="container footer-pg">
                    <div className="row text-center text-xs-center text-sm-center text-md-center">
                        <div className="col-xs-8 col-sm-4 col-md-4">
                            <h5 className="first">More About Us</h5>
                            <li className="list-unstyled quick-links" id="about-us">
                                MyEvent is created in 2019, started as a project for INFS3202 course at
                                The University of Queensland, St. Lucia campus. It is developed by Vincentius
                                Aditya Sundjaja (45610099) for around 5 months. React JS and Firebase is used to
                                build this web information system.
                            </li>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-4">
                            <h5>Site Map</h5>
                            <ul className="list-unstyled quick-links">
                                <li><a href=""><i className="fa fa-angle-double-right"/>Home</a></li>
                                <li><a href="#section03"><i className="fa fa-angle-double-right"/>About</a></li>
                                <li><a><i className="fa fa-angle-double-right"/>FAQ</a></li>
                                <li><a href={ROUTES.SIGN_UP}><i className="fa fa-angle-double-right"/>Get Started</a></li>
                                <li><a><i className="fa fa-angle-double-right"/>Videos</a></li>
                            </ul>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-4">
                            <h5>Contact Us</h5>
                            <ul className="list-unstyled quick-links">
                                <li><a>Building 63, Physiology, Room 348</a></li>
                                <li><a>Thursday, 14:00 - 15:50</a></li>
                                <li><a>(+61) 466 519 144</a></li>
                                <li><a>s4561009@student.uq.edu.au</a></li>
                                <li><a>vasundjaja@gmail.com</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row row-social">
                        <div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-5">
                            <ul className="list-unstyled list-inline social text-center">
                                <li className="list-inline-item"><a><i className="fa fa-facebook"/></a>
                                </li>
                                <li className="list-inline-item"><a><i className="fa fa-twitter"/></a>
                                </li>
                                <li className="list-inline-item"><a><i className="fa fa-instagram"/></a>
                                </li>
                                <li className="list-inline-item"><a><i className="fa fa-google-plus"/></a>
                                </li>
                                <li className="list-inline-item"><a><i className="fa fa-envelope"/></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-2 text-center text-white">
                            <p><u><a href="https://www.courses.uq.edu.au/student_section_loader.php?profileId=97411&section=1">Web
                                Information System</a></u> is
                                a INFS3202 Course in The University of Queensland, Brisbane [QLD, Australia]</p>
                            <p className="h6">&copy; All right Reversed.<a className="text-green ml-2" href="/">MyEvent</a></p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default hot(module) (Footer);