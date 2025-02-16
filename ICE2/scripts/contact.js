"use strict";

/**
 * Represents a Contact with a name, contact number, and email address.
*/
(function(core)
	{
		class Contact {

			/**
			 * Constructs a new Contact instance
			 * @param {string} fullName
			 * @param {string} contactNumber
			 * @param {string} emailAddress
			*/
			constructor(fullName = "", contactNumber = "", emailAddress = "") {
				this._fullName = fullName;
				this._contactNumber = contactNumber;
				this._emailAddress = emailAddress;

				console.log("Contact created!");
			}

			/**
			 * Gets the full name of the Contact
			 * 
			 * @returns {string}
			 */
			get fullName() {
				return this._fullName;
			}

			/**
			 * Sets the full name of the Contact
			 * 
			 * @param {string} fullName
			 */
			set fullName(fullName) {
				if(typeof(fullName) !== "string" || fullName.trim() === ""){
					throw new Error("Invaid fullName: must be a non-empty string.");
				}

				this._fullName = fullName;
			}

			/**
			 * Gets the contact number of the Contact
			 * 
			 * @returns {string}
			 */
			get contactNumber() {
				return this._contactNumber;
			}

			/**
			 * Sets the contact number of the Contact.
			 * 	Validates input to ensure a standard phone number format.
			 * 
			 * @param {string} contactNumber 
			 */
			set contactNumber(contactNumber) {
				if(typeof(contactNumber) !== "string" || contactNumber.trim() === ""){
					throw new Error("Invaid contactNumber: must be a non-empty string.");
				}

				const phoneRegex = /^\d{0,3}\+?\d{3}-?\d{3}-?\d{4}$/;

				if(!phoneRegex.test(contactNumber)){
					throw new Error("Invalid contactNumber: must be a valid phone number.");
				}

				this._contactNumber = contactNumber;
			}

			/**
			 * Gets the email address of the Contact.
			 * 
			 * @returns {string}
			 */
			get emailAddress() {
				return this._emailAddress;
			}

			/**
			 * Sets the email address of the Contact.
			 * 	Validates input to ensure a standard email format.
			 * 
			 * @param {string} emailAddress
			 */
			set emailAddress(emailAddress) {
				if(typeof(emailAddress) !== "string" || emailAddress.trim() === ""){
					throw new Error("Invaid emailAddress: must be a non-empty string.");
				}

				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic email format

				if(!emailRegex.test(emailAddress)){
					throw new Error("Invalid emailAddress: must be a valid email address.");
				}
				
				this._emailAddress = emailAddress;
			}

			/**
			 * Converts the contact details into a human-readable string.
			 * @returns {string}
			 */
			toString(){
				return `Full Name: ${this._fullName}\nContact Number: ${this._contactNumber}\nEmailAddress: ${this._emailAddress}`;
			}

			/**
			 * Serializes the contact details into a string format suitable for storage.
			 * 
			 * @returns {string|null}
			 */
			serialise() {
				if(
					!(this._fullName &&
					this._contactNumber &&
					this._emailAddress)
				){
					console.error("One or more of the contact properties are missing!");
					return null;
				}
				return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
			}

			/**
			 * Deserialises a string (comma delimited) of contact details and update properties.
			 * 
			 * @param {string} data
			 */
			deserialise(data) {
				if(typeof(data) !== "string" || data.split(",").length !== 3){
					console.error("Invalid data format for deserialising data.");
					return;
				}

				const propArray = data.split(",");

				this._fullName = propArray[0];
				this._contactNumber = propArray[1];
				this._emailAddress = propArray[2];
			}
		}
		core.Contact = Contact;
	}
)(core || (core = {}));