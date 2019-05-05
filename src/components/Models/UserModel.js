class UserModel {

    constructor(id, data) {
        this._userId = id;
        this._uniqueId = data.uniqueId;
        this._firstName = data.firstName;
        this._lastName = data.lastName;
        this._email = data.email;
        this._phone = data.phone;
        this._profession = data.profession;
        this._description = data.description;
        this._address = data.address;
        this._address2 = data.address2;
        this._city = data.city;
        this._country = data.country;
        this._id = id;
        this._data = data;
    }


    get id() {
        return this._id;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get uniqueId() {
        return this._uniqueId;
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get phone() {
        return this._phone;
    }

    set phone(value) {
        this._phone = value;
    }

    get profession() {
        return this._profession;
    }

    set profession(value) {
        this._profession = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }

    get address2() {
        return this._address2;
    }

    set address2(value) {
        this._address2 = value;
    }

    get city() {
        return this._city;
    }

    set city(value) {
        this._city = value;
    }

    get country() {
        return this._country;
    }

    set country(value) {
        this._country = value;
    }
}
