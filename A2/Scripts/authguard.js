"use strict";

// IIFE - Immediately Invoked Functional Expression
(function () {
	// Check if the user is logged in.
	if (sessionStorage.getItem("user") === null) {
		// Redirect the user to the login page.
		window.location.href = "login.html";
	}
	
})();