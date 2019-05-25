import AuthUserContext from "../Session/context";

class EventModel {

    constructor(id, data) {
        this._eventId = id;
        this._attendees = data.attendees;
        this._creatorId = data.creatorId;
        this._eventCategory = data.eventCategory;
        this._eventDescription = data.eventDescription;
        this._eventEnd = data.eventEnd;
        this._eventLocation = data.eventLocation;
        this._eventOrganizer = data.eventOrganizer;
        this._eventPrivacy = data.eventPrivacy;
        this._eventStart = data.eventStart;
        this._eventTicket = data.eventTicket;
        this._eventTicketLeft = data.eventTicketLeft;
        this._eventTicketP = data.eventTicketP;
        this. _eventTicketQ = data.eventTicketQ;
        this._eventTitle = data.eventTitle;
        this._data = data;
    }

    get eventId() {
        return this._eventId;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get attendees() {
        return this._attendees;
    }

    set attendees(value) {
        this._attendees = value;
    }

    get creatorId() {
        return this._creatorId;
    }

    set creatorId(value) {
        this._creatorId = value;
    }

    get eventCategory() {
        return this._eventCategory;
    }

    set eventCategory(value) {
        this._eventCategory = value;
    }

    get eventDescription() {
        return this._eventDescription;
    }

    set eventDescription(value) {
        this._eventDescription = value;
    }

    get eventEnd() {
        return this._eventEnd;
    }

    set eventEnd(value) {
        this._eventEnd = value;
    }

    get eventLocation() {
        return this._eventLocation;
    }

    set eventLocation(value) {
        this._eventLocation = value;
    }

    get eventOrganizer() {
        return this._eventOrganizer;
    }

    set eventOrganizer(value) {
        this._eventOrganizer = value;
    }

    get eventPrivacy() {
        return this._eventPrivacy;
    }

    set eventPrivacy(value) {
        this._eventPrivacy = value;
    }

    get eventStart() {
        return this._eventStart;
    }

    set eventStart(value) {
        this._eventStart = value;
    }

    get eventTicket() {
        return this._eventTicket;
    }

    set eventTicket(value) {
        this._eventTicket = value;
    }

    get eventTicketLeft() {
        return this._eventTicketLeft;
    }

    set eventTicketLeft(value) {
        this._eventTicketLeft = value;
    }

    get eventTicketP() {
        return this._eventTicketP;
    }

    set eventTicketP(value) {
        this._eventTicketP = value;
    }

    get eventTicketQ() {
        return this._eventTicketQ;
    }

    set eventTicketQ(value) {
        this._eventTicketQ = value;
    }

    get eventTitle() {
        return this._eventTitle;
    }

    set eventTitle(value) {
        this._eventTitle = value;
    }

    getStartDate() {
        return this._eventStart.split(" ")[0];
    }

    getPrivacyStatus() {
        if (this._eventPrivacy === "1") {
            return "Public";
        } else if (this._eventPrivacy  === "2") {
            return "Private";
        } else {
            return "";
        }
    }

    getTicketStatus() {
        if (this._eventTicket === "1") {
            return "Free Event";
        } else if (this._eventTicket  === "2") {
            return "Paid Event";
        } else {
            return "";
        }
    }

    getEventDateTimeString() {
        const split_start = this._eventStart.split(" ");
        const split_end = this._eventEnd.split(" ");

        const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };

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
                str_date_start + " (" + str_time_start + ")" + "\n" +
                "to" + "\n" +
                str_date_end + " (" + str_time_end + ")";
        }

        return composed_str;
    }

    getAttendees() {
        const user = this._attendees.user ? this._attendees.user.length : 0;
        const guest = this._attendees.guest ? this._attendees.guest.length : 0;
        if ((user+guest) === 1){
            return "1 person is going";
        } else {
            return (user+guest) + " people are going";
        }
    }

    getEventStartTimeForCard() {
        const split_start = this._eventStart.split(" ");

        const options = { weekday: 'long', month: 'short', day: 'numeric' };

        const date_start = new Date(split_start[0]);
        const str_date_start = date_start.toLocaleDateString("en-US", options);

        let composed_str = str_date_start;

        return composed_str;
    }

    getEventDateTimeStringForCard() {
        const split_start = this._eventStart.split(" ");

        const options = { weekday: 'short', month: 'short', day: 'numeric' };

        const date_start = new Date(split_start[0]);
        const str_date_start = date_start.toLocaleDateString("en-US", options);

        const str_time_start = split_start[1] + " " + split_start[2];

        let composed_str = str_date_start + ", " + str_time_start + "\n";

        return composed_str;
    }

}

export default EventModel;
