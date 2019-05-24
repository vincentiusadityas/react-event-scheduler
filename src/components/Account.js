import $ from "jquery";
import React, {Component} from 'react';
import * as firebase from "firebase/app";
import 'firebase/storage';
import { compose } from 'recompose';

import { withAuthorization } from './Session';
import {withFirebase} from "./Firebase";
import {withRouter} from "react-router-dom";

import '../css/Account.css'
import {Badge, Button, Modal, Spinner, Popover, OverlayTrigger} from "react-bootstrap";
import UserModel from  "./Models/UserModel"
import {hot} from "react-hot-loader";

class AccountFormBase extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            showChangePwModal: false,
            showEmailSentModal: false,
            user: [],
            imgUrl: null,
            description: '',
            emailVerified: null,
        };

        $(document).ready(function() {
            // $("input[type=\"file\"]#image-upload").change(function(input) {
            //     // console.log(input)
            //     // console.log(input.target.files[0])
            //     if (input.target.files && input.target.files[0]) {
            //         // console.log("hah")
            //         const reader = new FileReader();
            //         reader.onload = function(e) {
            //             $('#image-preview').css('background-image', 'url('+e.target.result +')');
            //             $('#image-preview').hide();
            //             $('#image-preview').fadeIn(650);
            //         }
            //         // console.log("huh")
            //         reader.readAsDataURL(input.target.files[0]);
            //     }
            // });

            $('#validation-item-custom-old-password').hide();
            $('#validation-item-custom-old-password-wrong').hide();
            $('#validation-item-custom-new-password').hide();
            $('#validation-item-custom-new-password-confirm').hide();
            $('#validation-item-custom-new-password-not-match').hide();
            $('#validation-item-custom-new-password-not-strong').hide();
            $('#change-pw-btn').prop('disabled', true);

            // console.log("waaa")
            $("#profile-edit-btn").click(function() {
                $(".my-profile").prop("readonly", false);
                $("#profile-edit-btn").hide();
                $("#profile-save-btn").show();
                $("#description").css('background-color', 'white');

                $('#change-pw-btn').prop('disabled', false);
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
                $('#change-pw-btn').prop('disabled', true);
            });
        });
    };

    componentDidMount() {
        const userId = firebase.auth().currentUser.uid;
        const userRef = firebase.database().ref('/users/' + userId);
        const storage = firebase.storage();

        userRef.on('value', (snapshot) => {
            // convert messages list from snapshot
            let data = snapshot.val();
            const userModel = new UserModel(userId, data);
            // console.log(data);

            this.setState({
                    user: userModel,
                    loading: true,
                    description: data.description,
                    emailVerified: firebase.auth().currentUser.emailVerified,
                });
        });

        storage.ref('images').child(userId).getDownloadURL().then(url => {
            this.setState({ imgUrl: url});
        }, () => {
            this.setState({ imgUrl: null});
        })
    };

    // componentWillUnmount() {
    //     firebase.database().off();
    // }
    onImageChange = (input) => {

        // console.log(input.target.files[0])
        const userId = firebase.auth().currentUser.uid;
        const storage = firebase.storage();
        const avatar = input.target.files[0];

        if (input.target.files && avatar) {
            const reader = new FileReader();
            const image_preview = $('#image-preview');
            reader.onload = function(e) {
                image_preview.css('background-image', 'url('+e.target.result +')');
                image_preview.hide();
                image_preview.fadeIn(650);
            };
            reader.readAsDataURL(avatar);

            const uploadAvatar = storage.ref('images/'+userId).put(avatar);;
            uploadAvatar.on('state_changed', (snapshot) => {

            }, (error) => {
                console.log(error);
            }, () => {
                storage.ref('images').child(userId).getDownloadURL().then(url => {
                    // console.log(url);
                });
            });
        }
    };

    onSubmit = event => {
        event.preventDefault();
        const data = new FormData(event.target);

        $('#change-pw-btn').prop('disabled', true);
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

    handlePasswordChange = (event) => {
        event.preventDefault();

        if (!$('#change-pw-btn').prop('disabled')) {
            // console.log("test");
            let isValid = false;
            const oldPw = $('#oldPassword');
            const newPw = $('#newPassword');
            const newPwConfirm = $('#newPasswordConfirm');

            if(oldPw.val() === "") {
                $('#validation-item-custom-old-password').show();
                isValid = false;
            } else {
                $('#validation-item-custom-old-password').hide();
                isValid = true;
            }
            if(newPw.val() === "") {
                $('#validation-item-custom-new-password').show();
                isValid = false;
            } else {
                $('#validation-item-custom-new-password').hide();
                if(newPw.val().length < 5 || !/\d/.test(newPw.val())) {
                    // console.log("wrong");
                    $('#validation-item-custom-new-password-not-strong').show();
                    isValid = false;
                } else {
                    $('#validation-item-custom-new-password-not-strong').hide();
                    isValid = true;
                }
            }
            if(newPwConfirm.val() === "") {
                $('#validation-item-custom-new-password-confirm').show();
                isValid = false;
            } else {
                $('#validation-item-custom-new-password-confirm').hide();
                isValid = true;
            }
            if(newPw.val() !== newPwConfirm.val()) {
                $('#validation-item-custom-new-password-not-match').show();
                isValid = false;
            } else {
                $('#validation-item-custom-new-password-not-match').hide();
                if(newPw.val().length < 5 || !/\d/.test(newPw.val())) {
                    // console.log("wrong");
                    $('#validation-item-custom-new-password-not-strong').show();
                    isValid = false;
                } else {
                    $('#validation-item-custom-new-password-not-strong').hide();
                    isValid = true;
                }
            }

            if (isValid) {
                this.setState({ isLoading: true });
                $('#change-pw-btn').prop('disabled', true);
                oldPw.prop('disabled', true);
                newPw.prop('disabled', true);
                newPwConfirm.prop('disabled', true);
                this.changePassword(oldPw.val(), newPw.val());
                console.log("password changed");
            }
        }
    };

    changePassword = (currentPassword, newPassword) => {
        this.reauthenticate(currentPassword).then(() => {
            const user = firebase.auth().currentUser;
            user.updatePassword(newPassword).then(() => {

                this.handleChangePasswordModalShow();
                this.setState({ isLoading: false });

                $('#oldPassword').val("");
                $('#newPassword').val("");
                $('#newPasswordConfirm').val("");
                $('#change-pw-btn').prop('disabled', false);
                $('#oldPassword').prop('disabled', false);
                $('#newPassword').prop('disabled', false);
                $('#newPasswordConfirm').prop('disabled', false);
                $('#validation-item-custom-old-password-wrong').hide();

            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
            this.setState({ isLoading: false });

            $('#oldPassword').val("");
            $('#newPassword').val("");
            $('#newPasswordConfirm').val("");
            $('#change-pw-btn').prop('disabled', false);
            $('#oldPassword').prop('disabled', false);
            $('#newPassword').prop('disabled', false);
            $('#newPasswordConfirm').prop('disabled', false);
            $('#validation-item-custom-old-password-wrong').show();
        });
    };

    reauthenticate = (currentPassword) => {
        const user = firebase.auth().currentUser;
        const cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleChangePasswordModalShow = () => {
        this.setState({ showChangePwModal: true });
    };

    handleChangePasswordModalClose = () => {
        this.setState({ showChangePwModal: false });
    };

    handleEmailSentModalShow = () => {
        this.setState({ showEmailSentModal: true });
    };

    handleEmailSentModalClose = () => {
        this.setState({ showEmailSentModal: false });
    };

    onSendEmailVerification = () => {
        // console.log("email sent");
        $('#email-unverified')[0].click(function(){
        });
        this.props.firebase
            .doSendEmailVerification()
            .then(() => this.handleEmailSentModalShow());
    };

    render() {
        let { user, isLoading, showChangePwModal, showEmailSentModal, imgUrl, description, emailVerified } = this.state;

        const firstName = user.firstName;
        const lastName = user.lastName;
        const uniqueId = user.uniqueId;
        const email = user.email;
        const phone = user.phone;
        const profession = user.profession;

        return (
            <div>
                <Modal
                    size="sm"
                    show={showChangePwModal}
                    onHide={this.handleChangePasswordModalClose}
                    aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-sm">
                            Change Password
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Password update success!</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleChangePasswordModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    size="sm"
                    show={showEmailSentModal}
                    onHide={this.handleEmailSentModalClose}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Verification Email
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>A verification email has been sent. Please check your email!</Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleEmailSentModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>

                <section id="section-my-account">
                    <div className="container emp-profile top-pg">
                        <form onSubmit={this.onSubmit} id="profile-form">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit">
                                            <input type='file' id="image-upload" accept=".png, .jpg, .jpeg"
                                                onChange={this.onImageChange}/>
                                            <label htmlFor="image-upload"/>
                                        </div>
                                        {imgUrl === null ?
                                            <div className="avatar-preview">
                                                <div id="image-preview2">
                                                </div>
                                            </div>
                                            :
                                            <div className="avatar-preview">
                                                <div id="image-preview" style={{backgroundImage: "url(" + imgUrl + ")"}}>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="profile-head">
                                        <h2>
                                            {firstName} {lastName} {" "}
                                            {emailVerified ?
                                                <Badge className="email-badge" id="email-verified" pill variant="success">
                                                    Email Verified
                                                </Badge>
                                                :
                                                <OverlayTrigger
                                                    trigger="click"
                                                    key="top"
                                                    placement="top"
                                                    overlay={
                                                        <Popover
                                                            id={`popover-positioned-top`}
                                                            title={`Email Un-Verified`}
                                                        >
                                                            <strong>Verify</strong> your email to unlock all features.
                                                            <a href="javascript:void(0);" onClick={this.onSendEmailVerification}> Resend </a> confirmation E-Mail now.
                                                        </Popover>
                                                    }
                                                >
                                                    <a id="email-unverified" className="badge badge-warning email-badge">Email Un-Verified</a>
                                                </OverlayTrigger>
                                            }
                                        </h2>
                                        {profession ?
                                            <h5>
                                                I am a {profession}
                                            </h5>
                                            :
                                            <div></div>
                                        }

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
                                        <a>My Events</a><br/>
                                        <a>My Bookings</a><br/>
                                        <a>Bookmarks</a><br/>
                                        <a>Event History</a><br/>
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
                                                    <textarea className="form-control my-profile" name="description"
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
                                                    <div id="validation-item-custom-old-password"
                                                         className="validation-advice">This is a required field.
                                                    </div>
                                                    <div id="validation-item-custom-old-password-wrong"
                                                         className="validation-advice">Password invalid.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row form-change-password">
                                                <div className="col-md-8">
                                                    <p className="custom-headers"> New Password </p>
                                                    <input type="password" className="form-control my-profile" name="newPassword"
                                                           id="newPassword" onChange={this.onChange} readOnly/>
                                                    <div id="validation-item-custom-new-password"
                                                         className="validation-advice">This is a required field.
                                                    </div>
                                                    <div id="validation-item-custom-new-password-not-strong"
                                                         className="validation-advice">Password must have at least 5 characters and contains a number.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row form-change-password">
                                                <div className="col-md-8">
                                                    <p className="custom-headers"> Confirm New Password </p>
                                                    <input type="password" className="form-control my-profile" name="newPasswordConfirm"
                                                           id="newPasswordConfirm" onChange={this.onChange} readOnly/>
                                                    <div id="validation-item-custom-new-password-confirm"
                                                         className="validation-advice">This is a required field.
                                                    </div>
                                                    <div id="validation-item-custom-new-password-not-match"
                                                         className="validation-advice">Password does not match.
                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <div className="row form-change-password">
                                                <div className="col-md-8">
                                                    <Button variant="primary" id="change-pw-btn" onClick={this.handlePasswordChange}>
                                                        {isLoading ?
                                                            <div>
                                                                <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                                /> <span> Changing </span>
                                                            </div>
                                                            :
                                                            <div>
                                                                Change Password
                                                            </div>
                                                        }
                                                    </Button>
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

// export default withEmailVerification(withAuthorization(condition))(Account);

// export default compose(
//     withAuthorization(condition),
//     withRouter,
//     withFirebase,
// )(Account);

export default hot(module) (withAuthorization(condition)(Account));
