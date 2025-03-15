

"use strict";

import { Page, Pages } from "../page.js";
import { getElementByIdSafe } from "../../html_utilities.js";
import { AddContact } from "../../contact.js";

export const ContactPage = new Page(
	"ContactPage",
	"contact",
	() => {
		/** @type {HTMLButtonElement?} */
		let sendButton = getElementByIdSafe("sendButton");
		/** @type {HTMLInputElement?} */
		let subscribeCheckbox = getElementByIdSafe("subscribeCheckbox");

		sendButton?.addEventListener("click", function(event){
			event.preventDefault();
			
			// Check if the subscribe checkbox has been checked.
			if(subscribeCheckbox?.checked){

				// Create the contact.
				AddContact(
					getElementByIdSafe("fullName"),
					getElementByIdSafe("contactNumber"), 
					getElementByIdSafe("emailAddress")
				)

				// Navigate back to this page.
				ContactPage.navigateTo();
			}
		});
	}
);

Pages.ContactPage = ContactPage;
