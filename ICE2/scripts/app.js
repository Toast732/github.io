"use strict";

// IIFE - Immediately Invoked Functional Expression
(function () {

	async function DisplayWeather() {
		const apiKey = "REDACTED";

		const city = "Oshawa";

		const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

		try {
			const response = await fetch(url);

			if(!response.ok){
				throw new Error("Failed to fetch wether data from openweathermap.org.")
			}

			const data = await response.json();

			console.log("Weather API Response", data);

			const weatherDataElement = document.getElementById("weather-data");

			weatherDataElement.innerHTML = `<strong>City:</strong> ${data.name}<br><strong>Temperature:</strong> ${data.main.temp}<br><strong>Weather:</strong> ${data.weather[0].description}`;
		} catch (error) {
			console.error("Error fetching weather data", error);
			document.getElementById("weather-data").textContent = "Unable to contact weather data at this time";
		}
	}

	function InjectHeader() {
		console.log("Injecting Header...");

		
		return fetch("./header.html")
			.then(response => response.text())
			.then(
				data =>
				{
					console.log(data)
					document.querySelector("header").innerHTML = data;
					HighlightActivePage();
				}
			)
			.catch(error => console.error("Unable to load header: ", error)
		)
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

	/**
	 * Highlights the active page in the nav bar.
	 */
	function HighlightActivePage(){

		console.log("Highlighting Active Page...");

		// Get the name of our current page.
		let pageName = document.title.trim();

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

	// A safe version of getElementByID, which will print an error if it fails to find the element.
	/** @returns {HTMLElement | null | any} */
	function getElementByIdSafe(id) {
		// Attempt to get the element.
		let element = document.getElementById(id);

		// If it's null, print an error.
		if(element === null){
			console.error(`Failed to find element with ID: ${id}`);
		}

		// Return the element.
		return element;
	}

    function DisplayHomePage(){
        console.log("Calling DisplayHomePage()...");

        let aboutUsButton = document.getElementById("AboutUsBtn");

		// Arrow Notation.
        aboutUsButton?.addEventListener("click", () => {
			// Set the path we're wanting to navigate to.
			let NavPath = "/about.html";
			
			// Check if we contain github.io in our path.
			if(location.href.match("/github.io")) {
				NavPath = "/github.io" + NavPath;
			}

			// Navigate to the path.
            location.href=NavPath;
        });

		// Add call to weathermap.org
		DisplayWeather();

		// Add content to the main element in index.html
		document.querySelector("main")?.insertAdjacentHTML(
			"beforeend", 
			`<p id="MainParagraph" class="mt-3">This is the First Paragraph</p>`
		);

		// Add article with paragraph to the body.
		document.body?.insertAdjacentHTML(
			"beforeend", 
			`
				<article class="container">
					<p id="ArticleParagraph" class="mt-3">
						This is my Article Paragraph
					</p>
				</article>
			`
		);
    }

	function AddContact(fullName, contactNumber, emailAddress){
		let contact = new core.Contact(
			fullName.value,
			contactNumber.value,
			emailAddress.value
		)

		// Get the serialised contact.
		let serialisedContact = contact.serialise();

		// Ensure it's not null.
		if(serialisedContact !== null){
			// The primary key for a contact --> contact_ + date & time.
			let key = `contact_${Date.now()}`;

			// Store the contact in local storage.
			localStorage.setItem(key, serialisedContact);
		} else {
			console.error("Failed to serialise the contact!");
		}
	}

    function DisplayAboutPage(){
        console.log("Calling DisplayAboutPage()...");
    }

    function DisplayProductsPage(){
        console.log("Calling DisplayProductsPage()...");
    }

    function DisplayServicesPage(){
        console.log("Calling DisplayServicesPage()...");
    }

    function DisplayContactPage(){
        console.log("Calling DisplayContactPage()...");

		/** @type {HTMLButtonElement?} */
		let sendButton = getElementByIdSafe("sendButton");
		/** @type {HTMLInputElement?} */
		let subscribeCheckbox = getElementByIdSafe("subscribeCheckbox");

		sendButton?.addEventListener("click", function(){
			// Check if the subscribe checkbox has been checked.
			if(subscribeCheckbox?.checked){

				// Create the contact.
				AddContact(
					getElementByIdSafe("fullName"),
					getElementByIdSafe("contactNumber"), 
					getElementByIdSafe("emailAddress")
				)
				
			}
		});
    }

	function DisplayContactListPage(){
		console.log("Calling DisplayContactList()...");

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
					let contact = new core.Contact()

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
			location.href = "edit.html#add";
		});

		const deleteButtons = document.querySelectorAll("button.delete");

		deleteButtons.forEach((button) => {
			button.addEventListener("click", function() {
				if(confirm("Delete contact, please confirm?")){
					localStorage.removeItem(this.value);
					location.href = "contact-list.html";
				}
			});
		});

		const editButtons = document.querySelectorAll("button.edit");

		editButtons.forEach((button) => {
			button.addEventListener("click", function() {
				location.href = "edit.html#" + this.value;
			});
		});

	}

	function DisplayEditPage(){
		console.log("Calling DisplayEditPage()...");

		const page = location.hash.substring(1);

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

						location.href = "contact-list.html";

					});
				}

				cancelButton?.addEventListener("click", function(event) {
					location.href = "contact-list.html";
				});

				break;
			default:
				// Edit Contact.
				const contact = new core.Contact();
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
					location.href = "contact-list.html";
				});

				cancelButton?.addEventListener("click", function(event) {
					location.href = "contact-list.html";
				});

				break;
		}
	}

	function DisplayLoginPage(){
		console.log("Calling DisplayLoginPage()...")

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
					let user = new core.User()

					// Load the user from the json data.
					user.fromJSON(user_data);
				}

				// Check if our user matches any entries in the user list.
				let user = core.User.doesUserExist(username.value, password.value);

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
					location.href = "contact-list.html";
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

	function DisplayRegisterPage(){
		console.log("Calling DisplayRegisterPage()...")
	}

    async function Start() {
        console.log("Starting...");
		console.log(`Current document title: ${document.title}`);

		// Inject the header.
		await InjectHeader();

		CheckLogin();

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;
			case "Contact List":
				DisplayContactListPage();
				break;
			case "Edit Contact":
				DisplayEditPage();
				break;
			case "Login":
				DisplayLoginPage();
				break;
			case "Register":
				DisplayRegisterPage();
				break;
			default:
				console.error(`Page is invalid: ${document.title}`)
				return;
        }
    }

    window.addEventListener("DOMContentLoaded", 
		() => {
			console.log("DOM fully loaded and parsed.");
			Start();
		}
	);
})();