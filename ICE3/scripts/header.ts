"use strict";

import { getElementByIdSafe } from "./html_utilities";

export function InjectHeader() {
	console.log("Injecting Header...");

	
	return fetch("./views/components/header.html")
		.then(response => response.text())
		.then(
			data =>
			{
				console.log(data)
				getElementByIdSafe("header").innerHTML = data;
				HighlightActivePage();
			}
		)
		.then(
			() => CheckLogin()
		)
		.catch(error => console.error("Unable to load header: ", error)
	)
}

/**
 * Highlights the active page in the nav bar.
 */
function HighlightActivePage(){

	console.warn("Highlighting Active Page...");

	// Get the name of our current page.
	let pageName = location.hash.slice(1);

	// Get page id depending upon title.
	let pageId = pageName[0].toLowerCase() + pageName.slice(1).replace(" ", "");

	// Attempt the find the page element.
	let pageElement = getElementByIdSafe(pageId + "NavLink");

	// If the page element is null, return.
	if(pageElement === null){
		console.log(`${pageName} has no associated nav link on the header.`);
		return;
	}

	// Set the aria-current attribute to page.
	pageElement.setAttribute("aria-current", "page");

	// Add the active class to the page
	pageElement.classList.add("active");
}

/** 
	 * Handles login/logout functionality.
	 * If a user is logged in, replace the login link with a logout link.
	 * Upon clicking, will logout the user, by clearing them from session storage.
*/
function CheckLogin(){
	// Get the login link.
	let loginLink = getElementByIdSafe("loginNavLink");

	// Get the user from session storage.
	let user = sessionStorage.getItem("user");

	// If the user is null, skip, as we're not logged in.
	if(user === null){
		return;
	}

	// Replace the link with href="#".
	loginLink.href = "#";

	// Replace the inner html with Logout, and a fontawesome icon..
	loginLink.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Logout`;

	// Add an event listener to the login link.
	loginLink.addEventListener("click", function(event) {
		// Clear the user from session storage.
		sessionStorage.removeItem("user");

		// Redirect to the login page.
		location.href = "login.html";
	});
}