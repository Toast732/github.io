"use strict"

class SignUp {

    /**
     *
     * @param fullName
     * @param emailAddress
     * @param preferredRole
     */
    constructor(fullName = "", emailAddress = "", preferredRole = "") {
        this._fullName = fullName;
        this._emailAddress = emailAddress;
        this._preferredRole = preferredRole;
    }

    get fullName() {
        return this._fullName;
    }

    set fullName(fullName) {
        if(typeof fullName !== "string" || fullName.trim() !== ""){
            throw new Error("Invalid full name");
        }
        this._fullName = fullName;
    }

    get emailAddress() {
        return this._emailAddress;
    }

    set emailAddress(emailAddress) {
        const emailRegex = /^[^\s@]+@[\s@]+\.[^\s@]+$/; //basic email format
        if (!emailRegex.test(emailAddress)) {
            throw new Error("Invalid email address: " + emailAddress);
        }
        this._emailAddress = emailAddress;
    }

    get preferredRole() {
        return this._preferredRole;
    }

    set preferredRole(preferredRole) {
        if(typeof preferredRole !== "string" || preferredRole.trim() !== ""){
            throw new Error("Invalid preferred role: " + preferredRole);
        }
        this._preferredRole = preferredRole;
    }

    toString(){
        return `Full Name: ${this._fullName}\n,
        Email Address: ${this.emailAddress}\n, 
        preferred role: ${this.preferredRole}\n`
    }

    serialize(){
        if (!this._fullName, !this._emailAddress, !this._preferredRole) {
            console.error("Invalid information");
            return null;
        }
        return `${this._fullName},${this._emailAddress},${this._preferredRole}`;

    }

    deserialize(data) {
        if(typeof data !== "string" || data.split(",").length !== 3) {
            console.error("Invalid data format for deserializing data.");
            return null;
        }
        const propArray = data.split(",");
        this._fullName = propArray[0];
        this._emailAddress = propArray[1];
        this._preferredRole = propArray[2];
    }

}