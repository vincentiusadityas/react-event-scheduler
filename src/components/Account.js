import $ from "jquery";
import React, {Component} from 'react';
import * as firebase from "firebase";

import { withAuthorization } from './Session';
import {withFirebase} from "./Firebase";
import {withRouter} from "react-router-dom";

import '../css/Account.css'
import * as ROUTES from "../constants/routes";

class AccountFormBase extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            user: [],
            description: "",
        };

        $(document).ready(function() {
            $("input[type=\"file\"]#image-upload").change(function(input) {
                // console.log(input)
                // console.log(input.target.files[0])
                if (input.target.files && input.target.files[0]) {
                    // console.log("hah")
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        $('#image-preview').css('background-image', 'url('+e.target.result +')');
                        $('#image-preview').hide();
                        $('#image-preview').fadeIn(650);
                    }
                    // console.log("huh")
                    reader.readAsDataURL(input.target.files[0]);
                }
            });

            // console.log("waaa")
            $("#profile-edit-btn").click(function() {
                $(".my-profile").prop("readonly", false);
                $("#profile-edit-btn").hide();
                $("#profile-save-btn").show();
                $("#description").css('background-color', 'white');

                $('#oldPassword').prop('disabled', false);
                $('#newPassword').prop('disabled', false);
                $('#newPasswordConfirm').prop('disabled', false);
            });
            $("#profile-save-btn").click(function() {
                $(".my-profile").prop("readonly", true);
                $("#profile-edit-btn").show();
                $("#profile-save-btn").hide();
                $("#description").css('background-color', '#e9ecef');

                $('#oldPassword').val("");
                $('#newPassword').val("");
                $('#newPasswordConfirm').val("");
            });
        });
    };

    componentDidMount() {
        const userId = firebase.auth().currentUser.uid;
        const userRef = firebase.database().ref('/users/' + userId);

        userRef.on('value', (snapshot) => {
            // convert messages list from snapshot
            let data = snapshot.val();
            // console.log(data);

            this.setState(
                { user: data,
                    loading: true,
                    description: data.description
                });
        });
    };

    // componentWillUnmount() {
    //     firebase.database().off();
    // }

    onSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);

        $('#oldPassword').prop('disabled', true);
        $('#newPassword').prop('disabled', true);
        $('#newPasswordConfirm').prop('disabled', true);
        // console.log(data);
        // console.log(data.get('fistName'));

        // console.log(data.entries());
        const dataDict = {};
        for(let pair of data.entries()) {
            dataDict[pair[0]] = pair[1];
        }
        // console.log(dataDict)
        this.updateUserProfile(dataDict);
        // const form = document.querySelector('form'),
        //     formData = new FormData(form),
        //     req = new XMLHttpRequest();
        //
        // req.open("POST", "/echo/html/")
        // req.send(formData);
    };

    updateUserProfile = (data) => {
        // console.log(data)
        const userId = firebase.auth().currentUser.uid;
        const userRef = firebase.database().ref('/users/' + userId);
        userRef.set(data)
            .then((data) => {
                console.log('data ', data);
            }).catch((error) => {
                //error callback
                console.log('error ' , error)
        });
    };

    handlePasswordChange = event => {

    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        let { user, loading, description } = this.state;

        // if (loading) {

        const firstName = user.firstName;
        const lastName = user.lastName;
        const uniqueId = user.uniqueId;
        const email = user.email;
        const phone = user.phone;
        const profession = user.profession;

        return (
            <div>
                <section id="section-my-account">
                    <div className="container emp-profile top-pg">
                        <form onSubmit={this.onSubmit} id="profile-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit">
                                            <input type='file' id="image-upload" accept=".png, .jpg, .jpeg"/>
                                            <label htmlFor="image-upload"/>
                                        </div>
                                        <div className="avatar-preview">
                                            <div id="image-preview">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="profile-head">
                                        <h2>
                                            {firstName} {lastName}
                                        </h2>
                                        <h5>
                                            {profession}
                                        </h5>
                                        <p className="profile-rating">RATINGS : <span>8/10</span></p>
                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="about-tab" data-toggle="tab"
                                                   href="#about" role="tab" aria-controls="about"
                                                   aria-selected="true">About</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="myContact-tab" data-toggle="tab"
                                                   href="#myContact" role="tab" aria-controls="myContact"
                                                   aria-selected="false">Address</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="myPassword-tab" data-toggle="tab"
                                                   href="#myPassword" role="tab" aria-controls="myPassword"
                                                   aria-selected="false">Password</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div id="profile-btn">
                                        <input type="button" id="profile-edit-btn" name="btnEditProf"
                                               value="Edit Profile"/>
                                        <input type="submit" id="profile-save-btn" name="btnSaveProf"
                                               value="Save Profile"/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="profile-work">
                                        <p>ACTIVITIES</p>
                                        <a href="">My Events</a><br/>
                                        <a href="">My Bookings</a><br/>
                                        <a href="">Bookmarks</a><br/>
                                        <a href="">Event History</a><br/>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div className="tab-content profile-tab" id="myTabContent">
                                        <div className="tab-pane fade show active" id="about" role="tabpanel"
                                             aria-labelledby="about-tab">
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <h3>About Me</h3>
                                                </div>
                                            </div>
                                            <div className="row form-about-me">
                                                <div className="col-md-6">
                                                    <p>User Id</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control" name="uniqueId"
                                                           id="uniqueId" defaultValue={uniqueId} onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-about-me">
                                                <div className="col-md-6">
                                                    <p>First Name</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control my-profile" name="firstName"
                                                           id="firstName" defaultValue={firstName} onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-about-me">
                                                <div className="col-md-6">
                                                    <p>Last Name</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control my-profile" name="lastName"
                                                           id="lastName" defaultValue={lastName} onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-about-me">
                                                <div className="col-md-6">
                                                    <p>Email</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control" name="email"
                                                           id="email" defaultValue={email} onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-about-me">
                                                <div className="col-md-6">
                                                    <p>Phone</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control my-profile" name="phone"
                                                           id="phone" defaultValue={phone} onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-about-me">
                                                <div className="col-md-6">
                                                    <p>Profession</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control my-profile" name="profession"
                                                           id="profession" defaultValue={profession} onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-about-me">
                                                <div className="col-md-12">
                                                    <p>Your Bio</p>
                                                    <textarea type="text" className="form-control my-profile" name="description"
                                                              id="description" value={description} onChange={this.onChange}
                                                              placeholder="Describe yourself here..." readOnly/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="myContact" role="tabpanel"
                                             aria-labelledby="myContact-tab">
                                            <h3>My Address</h3>
                                            <div className="row form-address">
                                                <div className="col-md-8">
                                                    <p className="custom-headers"> Address </p>
                                                    <input type="text" className="form-control my-profile"  name="address"
                                                           id="address" onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-address">
                                                <div className="col-md-8">
                                                    <p className="custom-headers"> Address 2 </p>
                                                    <input type="text" className="form-control my-profile" name="address2"
                                                           id="address2" onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-address">
                                                <div className="col-md-8">
                                                    <p className="custom-headers"> City </p>
                                                    <input type="text" className="form-control my-profile" name="city"
                                                           id="city" onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-address">
                                                <div className="col-md-8">
                                                    <p className="custom-headers"> Country </p>
                                                    <input type="text" className="form-control my-profile" name="country"
                                                           id="country" onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="myPassword" role="tabpanel"
                                             aria-labelledby="myPassword-tab">
                                            <h3> Change Password </h3>
                                            <div className="row form-change-password">
                                                <div className="col-md-8">
                                                    <p className="custom-headers"> Old Password </p>
                                                    <input type="password" className="form-control my-profile" name="oldPassword"
                                                           id="oldPassword" onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-change-password">
                                                <div className="col-md-8">
                                                    <p className="custom-headers"> New Password </p>
                                                    <input type="password" className="form-control my-profile" name="newPassword"
                                                           id="newPassword" onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                            <div className="row form-change-password">
                                                <div className="col-md-8">
                                                    <p className="custom-headers"> Confirm New Password </p>
                                                    <input type="password" className="form-control my-profile" name="newPasswordConfirm"
                                                           id="newPasswordConfirm" onChange={this.onChange} readOnly/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        );
        // } else {
        //     return <div></div>;
        // }
    }
}

const Account = () => (
    <div>
        <AccountBase />
    </div>
);

const condition = authUser => !!authUser;

const AccountBase = withRouter(withFirebase(AccountFormBase));

export default withAuthorization(condition)(Account);