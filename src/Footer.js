import React from 'react';
import {hot} from "react-hot-loader";

const Footer = () => {
    return (
        <div>
            <section id="section-footer">
                <div className="container footer-pg">
                    <div className="row text-center text-xs-center text-sm-center text-md-center">
                        <div className="col-xs-8 col-sm-4 col-md-4">
                            <h5 className="first">More About Us</h5>
                            <li className="list-unstyled quick-links" id="about-us">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                irure dolor in reprehenderit in voluptate velit esse cillum.
                            </li>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-4">
                            <h5>Site Map</h5>
                            <ul className="list-unstyled quick-links">
                                <li><a href=""><i className="fa fa-angle-double-right"></i>Home</a></li>
                                <li><a href="#section03"><i className="fa fa-angle-double-right"></i>About</a></li>
                                <li><a href=""><i className="fa fa-angle-double-right"></i>FAQ</a></li>
                                <li><a href="signup.html"><i className="fa fa-angle-double-right"></i>Get Started</a></li>
                                <li><a href=""><i className="fa fa-angle-double-right"></i>Videos</a></li>
                            </ul>
                        </div>
                        <div className="col-xs-8 col-sm-4 col-md-4">
                            <h5>Contact Us</h5>
                            <ul className="list-unstyled quick-links">
                                <li><a href="">Building 63, Physiology, Room 348</a></li>
                                <li><a href="">Thursday, 14:00 - 15:50</a></li>
                                <li><a href="">(+61) 466 519 144</a></li>
                                <li><a href="">s4561009@student.uq.edu.au</a></li>
                                <li><a href="">vasundjaja@gmail.com</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row row-social">
                        <div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-5">
                            <ul className="list-unstyled list-inline social text-center">
                                <li className="list-inline-item"><a href=""><i className="fa fa-facebook"></i></a>
                                </li>
                                <li className="list-inline-item"><a href=""><i className="fa fa-twitter"></i></a>
                                </li>
                                <li className="list-inline-item"><a href=""><i className="fa fa-instagram"></i></a>
                                </li>
                                <li className="list-inline-item"><a href=""><i className="fa fa-google-plus"></i></a>
                                </li>
                                <li className="list-inline-item"><a href="" target="_blank"><i
                                    className="fa fa-envelope"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-2 text-center text-white">
                            <p><u><a href="https://www.courses.uq.edu.au/student_section_loader.php?profileId=97411&section=1">Web
                                Information System</a></u> is
                                a INFS3202 Course in The University of Queensland, Brisbane [QLD, Australia]</p>
                            <p className="h6">&copy All right Reversed.<a className="text-green ml-2" href="https://www.sunlimetech.com"
                                                                      target="_blank">MyEvent</a></p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default hot(module) (Footer);