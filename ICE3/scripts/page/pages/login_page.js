"use strict";

import { Page, Pages } from "../page.js";
import { getElementByIdSafe } from "../../html_utilities.js";
import { User } from "../../user.js";

import { ContactListPage } from "./contact_list_page.js";

export const LoginPage = new Page(
	"LoginPage",
	"login",
	() => {
		// Get the warning message element.
		let warningMessage = getElementByIdSafe("messageArea");

		// Set our warning message to be hidden.
		warningMessage.style.display = "none";

		// Get the login button.
		let loginButton = getElementByIdSafe("loginButton");

		// Add an event listener to the login button.
		loginButton?.addEventListener("click", async function(event) {
			// Get the username and password fields.
			let username = getElementByIdSafe("username");

			let password = getElementByIdSafe("password");

			// Get the url of the user.json file.
			let url = "./data/user.json";

			// Fetch the users.json file.
			try {
				const response = await fetch(url);

				// If the response is not ok, throw an error.
				if(!response.ok){
					throw new Error("Failed to fetch user data.");
				}

				// Get the users, as json, from the response.
				const users = await response.json();

				// Iterate over each user, and load them from json.
				for (let user_data of users.users) {
					let user = new User()

					// Load the user from the json data.
					user.fromJSON(user_data);
				}

				// Check if our user matches any entries in the user list.
				let user = User.doesUserExist(username.value, password.value);

				// If the user is null, then the user does not exist.
				if(user === null){
					// Set the warning message to be visible.
					warningMessage.style.display = "block";

					// Focus the username field.
					username.focus();

					// Highlight the warning message with alert-danger.
					warningMessage.className = "alert alert-danger";

					// Set the warning message to be visible.
					warningMessage.textContent = "Invalid username or password.";
				} else {
					// Otherwise, add the user to the session storage.
					sessionStorage.setItem("user", user.serialise());

					// Hide the warning message.
					warningMessage.style.display = "none";

					// Redirect to the contact list page.
					ContactListPage.navigateTo();
				}
			} catch(error){
				// If there was an error, log it to the console.
				console.error("Error fetching user data: ", error);
			}
		})

		// Add the cancel button logic.
		let cancelButton = getElementByIdSafe("cancelButton");

		cancelButton?.addEventListener("click", function(event) {
			// Get the username and password fields.
			let username = getElementByIdSafe("username");

			let password = getElementByIdSafe("password");

			// Clear the username and password fields.
			username.value = "";
			password.value = "";

			// Redirect to the index.html page.
			location.href = "index.html";
		});
	}
);

Pages.LoginPage = LoginPage;