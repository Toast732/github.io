"use strict"

/*
Represents a contact with a full name, email address, subject, and message.
 */
class Contact {

    /**
     * Constructs a new contact instance
     * @param fullName
     * @param emailAddress
     * @param subject
     * @param message
     */
    constructor(fullName = "", emailAddress = "", subject = "", message = "") {
        this._fullName = fullName;
        this._emailAddress = emailAddress;
        this._subject = subject;
        this._message = message;
    }

    /*
    Returns the full name
    returns a string
     */
    get fullName() {
        return this._fullName;
    }
    /*
    sets the full name and checks to make sure that the input is a string and isn't empty
     */
    set fullName(fullName) {
        if (typeof fullName !== "string" || fullName.trim() === "") {
            throw new Error("Invalid full name: must be non-empty string");
        }
        this._fullName = fullName;
    }

    // sets the subject
    get subject(){
        return this._subject;
    }

    // gets the subject
    set subject(subject) {
        if(subject.trim() !== ""){
            throw new Error("Invalid subject");
        }
        this._subject = subject;
    }

    // sets the message
    get message(){
        return this._message;
    }

    // gets the message
    set message(message) {
        if(message.trim() !== ""){
            throw new Error("Invalid message");
        }
        this._message = message;
    }

    /*
    returns the email address
    returns a string
     */
    get emailAddress() {
        return this._emailAddress;
    }
    /*
    sets the email address if it matches normal email format
     */
    set emailAddress(emailAddress) {
        const emailRegex = /^[^\s@]+@[\s@]+\.[^\s@]+$/; //basic email format
        if (!emailRegex.test(emailAddress)) {
            throw new Error("Invalid email address: " + emailAddress);
        }
        this._emailAddress = emailAddress;
    }

    /**
     * converts contact details into a human-readable string
     * @returns {string}
     */
    toString(){
        return `Full Name: ${this._fullName}\n,
        Subject: ${this.subject}\n, 
        Message: ${this.message}\n,
        Email Address: ${this.emailAddress}`;
    }

    /**
     * Serializes the contact information into a string format suitable for storage
     * @returns {string|null}
     */
    serialize() {
        if(!this._fullName || !this._subject || !this._message || !this._emailAddress) {
            console.error("One or more of the contact properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this._subject},${this._message},${this._emailAddress}`;
    }

    /**
     * deserializes a string (comma-delimited) of contact details and update properties
     * @param data
     */
    deserialize(data) {
        if(typeof data !== "string" || data.split(",").length !== 4) {
            console.error("Invalid data format for deserializing data.");
            return null;
        }
        const propArray = data.split(",");
        this._fullName = propArray[0];
        this._subject = propArray[1];
        this._message = propArray[2];
        this._emailAddress = propArray[3];
    }

}