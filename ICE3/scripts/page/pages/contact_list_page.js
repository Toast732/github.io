"use strict";

import { Page, Pages } from "../page.js";
import { getElementByIdSafe } from "../../html_utilities.js";
import { Contact } from "../../contact.js";
import { EditPage } from "./edit_page.js";
import { AuthGuard } from "../../authguard.js";

export const ContactListPage = new Page(
	"ContactListPage",
	"contact-list",
	() => {
		if(!AuthGuard()){
			return;
		}

		if(localStorage.length > 0) {
			/** @type {HTMLTableElement} */
			let contactList = getElementByIdSafe("contactList");

			let html_data = "";

			let index = 0;

			// Get the keys in our local storage.
			let keys = Object.keys(localStorage);

			// Iterate over each key.
			keys.forEach(key => {
				// If the key does not start with contact_, continue.
				if(!key.startsWith("contact_")){
					return;
				}

				try {
					// Get the data from local storage.
					let localStorageValue = localStorage.getItem(key);

					// Create a new blank contact, but have it be filled out via derserialising the data.
					let contact = new Contact()

					// Deserialise the data.
					contact.deserialise(localStorageValue);

					// Add ourselves to the html data variable.
					html_data += `
						<tr>
							<th scope="row" class="text-centre">${index++}</th>
							<td>${contact.fullName}</td>
							<td>${contact.contactNumber}</td>
							<td>${contact.emailAddress}</td>
							<td class="text-center">
								<button value="${key}" class="btn btn-warning btn-sm edit">
									<i class="fa-solid fa-user-pen"></i> Edit
								</button>
							</td>
							<td class="text-center">
								<button value="${key}" class="btn btn-danger btn-sm delete">
									<i class="fa-solid fa-user-minus"></i> Delete
								</button>
							</td>
						</tr>`
				} catch (error) {
					console.error("Error deserialising contact data: ", error);
				}
			});

			// Replace all instances of 6 tab characters with nothing. Also, replace the first newline character.
			html_data.replaceAll("\t{6}", "").replace("^\n", "")

			contactList.innerHTML = html_data;
		}

		const addButton = getElementByIdSafe("addButton");

		addButton?.addEventListener("click", ()=> {
			EditPage.navigateTo("#add");
		});

		const deleteButtons = document.querySelectorAll("button.delete");

		deleteButtons.forEach((button) => {
			button.addEventListener("click", function() {
				if(confirm("Delete contact, please confirm?")){
					localStorage.removeItem(this.value);
					ContactListPage.navigateTo()
				}
			});
		});

		const editButtons = document.querySelectorAll("button.edit");

		editButtons.forEach((button) => {
			button.addEventListener("click", function() {
				EditPage.navigateTo("#" + this.value);
			});
		});
	}
);

Pages.ContactListPage = ContactListPage;