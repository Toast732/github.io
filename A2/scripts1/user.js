"use strict";

/**
 * Represents a User with a username, display name, email address, and a password.
*/
(function(core)
	{
		class User {

			// A list of all registered users.
			static _users = [];

			/**
			 * Constructs a new empty User instance
			*/
			constructor() {

				// Default our properties to empty strings, to supress the warnings.
				this._userName = "";
				this._displayName = "";
				this._emailAddress = "";
				this._password = "";
				
				// Add ourselves to the list of users.
				User._users.push(this);

				console.log("User created!");
			}

			/**
			 * Gets the user name of the User
			 * 
			 * @returns {string}
			 */
			get userName() {
				return this._userName;
			}

			/**
			 * Sets the user name of the User
			 * 	We just want to ensure it contains at least 3 characters, and is unique.
			 * 
			 * @param {string} userName
			 */
			set userName(userName) {
				if(typeof(userName) !== "string" || userName.length >= 3){
					throw new Error(`Invaid userName: ${userName} must be a string of at least 3 characters.`);
				}

				// Check if this username is unique.
				for (let user of User._users) {
					// If the username matches, then throw an error.
					if(user.userName === userName){
						throw new Error(`Invalid userName: ${userName} must be unique.`);
					}
				}

				this._userName = userName;
			}

			/**
			 * Gets the display name of the User
			 * 
			 * @returns {string}
			 */
			get displayName() {
				return this._displayName;
			}

			/**
			 * Sets the display name of the user.
			 * 	We just want to ensure it contains at least 3 characters.
			 * 
			 * @param {string} displayName 
			 */
			set displayName(displayName) {
				if(typeof(displayName) !== "string" || displayName.length >= 3){
					throw new Error(`Invaid displayName: ${displayName} must be a string of at least 3 characters.`);
				}

				this._displayName = displayName;
			}

			/**
			 * Gets the email address of the User.
			 * 
			 * @returns {string}
			 */
			get emailAddress() {
				return this._emailAddress;
			}

			/**
			 * Sets the email address of the User.
			 * 	Validates input to ensure a standard email format.
			 * 
			 * @param {string} emailAddress
			 */
			set emailAddress(emailAddress) {
				if(typeof(emailAddress) !== "string" || emailAddress.trim() === ""){
					throw new Error("Invaid emailAddress: must be a non-empty string.");
				}

				// Ensure the email address is unique.
				for (let user of User._users) {
					// If the email address matches, then throw an error.
					if(user.emailAddress === emailAddress){
						throw new Error(`Invalid emailAddress: ${emailAddress} must be unique.`);
					}
				}

				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // basic email format

				if(!emailRegex.test(emailAddress)){
					throw new Error("Invalid emailAddress: must be a valid email address.");
				}
				
				this._emailAddress = emailAddress;
			}

			/**
			 * Gets the password of the User.
			 * 
			 * @returns {string}
			 */
			get password() {
				return this._password;
			}

			/**
			 * Sets the password of the user.
			 * 	This is intended for new accounts only, as if there's already a password set, it will fail.
			 * 	For updating passwords, please use the updatePassword method.
			 * 
			 * @param {string} password
			 */
			set password(password) {
				// Validate our password.
				if(!this.validatePassword(password)){
					throw new Error("Invalid password! Please ensure it's at least 8 characters long!");
				}

				// If we already have a password set, then throw an error.
				if(this._password !== ""){
					throw new Error("Cannot set password of existing user without providing their old password!");
				}
				
				this._password = password;
			}

			/**
			 * Converts the user details into a human-readable string.
			 * @returns {string}
			 */
			toString(){
				return `User Name: ${this._userName}\nUser Number: ${this._displayName}\nEmailAddress: ${this._emailAddress}`;
			}

			/**
			 * Validates a password, seeing if it meets the minimum requirements.
			 * 	Currently, it just ensures it's a string, and 8 characters long.
			 * In the future, I should add stuff like minimum number, special character, capitalisation, etc.
			 * However, considering we just store the users in a json file SENT TO THE CLIENT TO VALIDATE FROM, this is the least of my worries.
			 * @returns {boolean}
			 */
			validatePassword(password){
				// Ensure it must be at least 8 characters long.
				if(typeof(password) !== "string" || password.length >= 8){
					return false;
				}

				return true;
			}

			/**
			 * 
			 * @param {string} oldPassword 
			 * @param {string} newPassword 
			 * 
			 * @returns {boolean}
			 */
			updatePassword(oldPassword, newPassword){
				// If the new password does not meet security requirements, then return false.
				if(!this.validatePassword(newPassword)){
					console.error("New password does not meet security requirements!");
					return false;
				}

				// If the old password does not match the current password, then return false.
				if(this._password !== oldPassword){
					console.error("Old password does not match current password!");
					return false;
				}

				// Update the password.
				this._password = newPassword;

				return true;
			}

			/**
			 * Serializes the user details into a string format suitable for storage.
			 * 
			 * @returns {string|null}
			 */
			serialise() {
				if(
					!(this._userName &&
					this._displayName &&
					this._emailAddress)
				){
					console.error("One or more of the user properties are missing!");
					return null;
				}
				return `${this._userName},${this._displayName},${this._emailAddress}`;
			}

			/**
			 * Deserialises a string (comma delimited) of user details and update properties.
			 * 
			 * @param {string} data
			 */
			deserialise(data) {
				if(typeof(data) !== "string" || data.split(",").length !== 3){
					console.error("Invalid data format for deserialising data.");
					return;
				}

				const propArray = data.split(",");

				this._userName = propArray[0];
				this._displayName = propArray[1];
				this._emailAddress = propArray[2];
			}

			/**
			 * Converts the user details into a JSON object.
			 * 
			 * @returns {object}
			*/
			toJSON(){
				return {
					UserName: this._userName,
					DisplayName: this._displayName,
					EmailAddress: this._emailAddress,
					Password: this._password,
				};
			}

			/**
			 * Loads a user from a JSON entry.
			 * 
			 * @param {object} data
			*/
			fromJSON(data){
				// We don't want to validate our json data, as it should all be pre-validated, and validating could cause crashes upon security requirement updates.
				this._displayName = data.DisplayName;
				this._emailAddress = data.EmailAddress;
				this._password = data.Password;
				this._userName = data.UserName;
			}

			/**
			 * Checks if a user exists, given the username and password.
			 *
			 * @param {string} userName
			 * @param {string} password
			 *  
			 * @returns {User?}
			*/
			static doesUserExist(userName, password){
				for (let user of User._users) {
					if(user.userName === userName && user.password === password){
						return user;
					}
				}
				return null;
			}
		}
		core.User = User;
	}
// @ts-ignore
)(core || (core = {}));