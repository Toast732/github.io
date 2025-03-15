"use strict";

import { Page, Pages } from "../page";
import { getElementByIdSafe } from "../../html_utilities";
import { Contact, AddContact } from "../../contact";
import { ContactListPage } from "./contact_list_page";
import { AuthGuard } from "../../authguard";

export const EditPage = new Page(
	"EditPage",
	"edit",
	(hash = "") => {
		if(!AuthGuard()){
			return;
		}

		if(hash == ""){
			console.error("Hash is empty!");
		}
		
		const page = hash.substring(1);
		
		const editButton = getElementByIdSafe("editButton");

		const cancelButton = getElementByIdSafe("cancelButton");

		switch(page){
			case "add":
				// Add Contact.
				const heading = document.querySelector("main>h1");

				// Update document title.
				document.title = "Add Contact";

				// Update heading.
				if(heading){
					heading.textContent = "Add Contact";
				}

				// Update Edit Button.
				if(editButton){
					editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add`;

					editButton.addEventListener("click", function(event) {
						
						// Prevent default form submission.
						event?.preventDefault();

						// Add Contact.
						AddContact(
							getElementByIdSafe("fullName"),
							getElementByIdSafe("contactNumber"),
							getElementByIdSafe("emailAddress")
						);

						
						ContactListPage.navigateTo();
					});
				}

				cancelButton?.addEventListener("click", function(event) {
					ContactListPage.navigateTo();
				});

				break;
			default:
				// Edit Contact.
				const contact = new Contact();
				const contactData = localStorage.getItem(page);

				if(contactData){
					contact.deserialise(contactData);
				}

				getElementByIdSafe("fullName").value = contact.fullName;
				getElementByIdSafe("contactNumber").value = contact.contactNumber;
				getElementByIdSafe("emailAddress").value = contact.emailAddress;

				editButton?.addEventListener("click", function(event) {
					// Prevent default form submission.
					event.preventDefault();

					contact.fullName = getElementByIdSafe("fullName").value;
					contact.contactNumber = getElementByIdSafe("contactNumber").value;
					contact.emailAddress = getElementByIdSafe("emailAddress").value;

					localStorage.setItem(page, contact.serialise());
					ContactListPage.navigateTo();
				});

				cancelButton?.addEventListener("click", function(event) {
					ContactListPage.navigateTo();
				});

				break;
		}
	}
);

Pages.EditPage = EditPage;