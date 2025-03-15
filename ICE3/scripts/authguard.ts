"use strict";

import { Pages } from "./page/page";

let sessionTimeout;

function resetSessionTimeout(){
	clearTimeout(sessionTimeout);
	sessionTimeout = setTimeout(() => {
		console.warn("Session expired");
		sessionStorage.removeItem("user");

		window.dispatchEvent(new CustomEvent("sessionExpired"))
	}, 15 * 60 * 1000) // 15 minutes of inactivity
}

export function AuthGuard(){
	const user = sessionStorage.getItem("user");

	// If there is no user, navigate to the login page.
	if(user === null){
		Pages.LoginPage.navigateTo();
		console.log("Unauthoried.");
		return false;
	}

	return true;

}