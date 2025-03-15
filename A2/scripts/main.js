/**
 * Authors: Devon O'brien, and Liam Matthews.
 * File Name: main.js
 * Date: 2025-02-23
 * Description:
 * 	This is the main file to handle the site, which helps direct which code should be ran depending on what page the
 * 		user is on, and additionally has some of it's own code for handling some pages.
 */


"use strict";

//IIFE = Immediately invoked function expression
(function () {

    async function DisplayGallery(){
        const imageId = [0, 5029859, 6646918, 6646815, 6647007];
        const apiKey = "cCbZslOP2T1B8MUPyTfoJIvDE1tZrpGEWiyGJsnwnmZL6Do44YLLzkiX";


        try{
            for (let i = 1; i < 5; i++) {
                const response = await fetch(`https://api.pexels.com/v1/photos/${imageId[i]}`, {
                    method: "GET",
                    headers: {
                        Authorization: apiKey
                    }
                })

                if(!response.ok) {
                    throw new Error("Failed to fetch image data from Pexels.com");
                }

                const data = await response.json();
                console.log("API response ", data);

                const imageElement = document.getElementById(`galleryImage${i}`);
                const slideElement = document.getElementById(`modalSlide${i}`);
                const imageControl = document.getElementById(`imageControl${i}`);

                imageElement.innerHTML = `<img id="galleryImage1" src=${data.src.original} onclick="openModal();currentSlide(${i})" class="hover-shadow" alt=${data.alt}>`;
                slideElement.innerHTML = `<div class="numbertext">${i} / 4</div>
                                          <img id="modalSlide1" src=${data.src.original} style="width:100%" alt="${data.alt}">`;
                imageControl.innerHTML = `<img class="demo" src=${data.src.original} onclick="currentSlide(${i})" alt="${data.alt}">`;
            }

        }catch(error){
            console.log("Error fetching image data", error);
			document.getElementById("galleryRow").innerHTML = "<h1>Failed to fetch images. Please try again later.</h1>";
		}

    }

    function handleEditClick(event, contact, page){
        event.preventDefault();
        if(!validateForm()){
            alert("Form contains errors, please correct before submitting")
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const emailAddress = document.getElementById("emailAddress").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        contact.fullName = fullName;
        contact.emailAddress = emailAddress;
        contact.subject = subject;
        contact.message = message;

        localStorage.setItem(page, contact.serialize());

        location.href = "contact-list.html";
    }

    function AddContact(fullName, emailAddress, subject, message) {
        console.log("adding contact");

        if(!validateForm()){
            alert("Form contains errors, please correct before submitting")
            return;
        }


        let contact = new core.Contact(fullName, emailAddress, subject, message);
        if(contact.serialize()){
            // The primary key if this table entry
            let Key = `contact_${Date.now()}`;
            localStorage.setItem(Key, contact.serialize());
        }
        else{
            console.error("contact serialization failed");
        }

        location.href = "contact-list.html";
    }

    function attachValidationListener(){
        console.log("Attaching validation listener");

        Object.keys(VALIDATION_RULES).forEach((fieldId) =>{
            const field = document.getElementById(fieldId);
            if (!fieldId){
                console.warn(`field ${fieldId} not found, skipping listener attachment.`);
                return;
            }

            addEventListenerOnce(fieldId, "input", () => validateInput(fieldId));
        });
    }

    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/,
            errorMessage: "Full Name must contain only letters and spaces"
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact number must be a number in the form of ###-###-####"
        },
        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Email address must contain only letters and spaces"
        }
    }

    function validateInput(fieldId){
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        const rule = VALIDATION_RULES[fieldId];

        if (!errorElement || !rule || !field) {
            console.log(`validation rule not found for ${fieldId}`);
            return false;
        }

        if(field.value.trim() === ""){
            errorElement.textcontent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        if(!rule.regex.test(field.value)){
            errorElement.textcontent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        errorElement.textcontent = "";
        errorElement.style.display = "none";
        return true;
    }

    function validateForm(){
        return (
            validateInput("fullName") &&
                validateInput("emailAddress")
        );
    }

    function handleAddClick(event){
        console.log("Add was clicked");

        event.preventDefault();

        if(!validateForm()){
            alert("Form contains errors, please correct before submitting")
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const emailAddress = document.getElementById("emailAddress").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        AddContact(fullName, emailAddress, subject, message);

        location.href = "contact-list.html";
    }

    function handleCancelClick(){
        location.href = "contact-list.html";
    }

    function addEventListenerOnce(elementId, event, handler){
        const element = document.getElementById(elementId);

        if(element){
            element.removeEventListener(event, handler);
            element.addEventListener(event, handler);
        }
        else{
            console.warn(`element with id ${element} not found`);
        }

    }

    function DisplayEditContact(){
        console.log("DisplayEditContact");

        const page = location.hash.substring(1);

        console.log(page);

        switch(page){
            case "add":{
                const heading = document.querySelector("main>h1").textContent = "Add Content";
                const editButton = document.getElementById("editButton");
                const cancelButton = document.getElementById("cancelButton");

                document.title = "Add Contact"

                if(editButton){
                    editButton.innerHTML = `<i class="fa-solid faa-open-to-square"></i>Add`
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");
                }

                addEventListenerOnce("editButton", "click", handleAddClick)
                addEventListenerOnce("cancelButton", "click", handleCancelClick)


            }
                break;

            default:{
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);

                if(contactData){
                    contact.deserialize(contactData);

                }

                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("emailAddress").value = contact.emailAddress;
                document.getElementById("subject").value = contact.subject;
                document.getElementById("message").value = contact.message;

                const editButton = document.getElementById("editButton");
                const cancelButton = document.getElementById("cancelButton");

                if(editButton){
                    editButton.innerHTML = `<i class="fa-solid faa-open-to-square"></i>Edit`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");
                }

                addEventListenerOnce("editButton", "click", (event)=> handleEditClick(event, contact, page))
                addEventListenerOnce("cancelButton", "click", (event)=> handleCancelClick())

            }
                break;
        }

    }

    /** 
	 * Handles login/logout functionality.
	 * If a user is logged in, replace the login link with a logout link.
	 * Upon clicking, will logout the user, by clearing them from session storage.
	 */
	function CheckLogin(){
		// Get the login link.
		let loginLink = getElementByIdSafe("login");

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

    function DisplayLogin(){
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

    function UpdateActiveNewLink(){
        console.log(["info updating active nav link"]);

        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll("nav a")

        navLinks.forEach(link => {
            if(link.textContent === currentPage){
                link.classList.add("active");
            }else{
                link.classList.remove("active");
            }
        });

    }

    /**
     *Load the nav bar for all html files
     */
    function LoadHeader(){
        console.log("Loading Header...");

        // when you want to await this fetch add a return before it ex return fetch(...
        return fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector("header").innerHTML = data;
                UpdateActiveNewLink();
            })
            .catch(error => console.log(error));
    }

    function LoadSearch(){
        console.log("Loading Search...");

        const searchButton = document.getElementById("search");
        const searchBar = document.getElementById("searchBar");
        const searchable = ["about", "contact", "donate", "edit", "events", "gallery", "home", "opportunities", "privacy policy", "terms of service"];
        const pages = ["about.html", "contact.html", "donate.html", "edit.html", "events.html", "gallery.html", "index.html", "opportunities.html", "privacy-policy.html", "tos.html"];

        if (searchButton){
            searchButton.addEventListener("click", function(){
                console.log(searchBar.value);
                for(let i = 0; i < pages.length; i++){
                    if(searchable[i] === (searchBar.value).trim().toLowerCase()){
                        console.log(pages[i]);
                        location.href = pages[i];
                    }
                    else{
                        console.log("no match");
                    }
                }
            })
        }
        else{
            console.log("No search found");
        }

    }

	// A safe version of getElementByID, which will print an error if it fails to find the element. - Written by Liam.
	/**
	 * @param {string} id  
	 * @returns {HTMLElement | null | any} 
	**/
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

	/** Sets up the dynamic nav bar. */
	function SetupDynamicNavBar(){
		// Get the opportunities nav link element.
		let opportunitiesNavLinkElement = getElementByIdSafe("opportunitiesNavLink");

		// Change replace any instance of "Opportunities" to "Volunteer Now" in the inner html.
		opportunitiesNavLinkElement.innerHTML = opportunitiesNavLinkElement.innerHTML.replace(/Opportunities$/, "Volunteer Now");

		// Get the nav bar list element.
		let navBarListElement = getElementByIdSafe("navBarList");

		// store if we're on the donate page.
		let isDonatePage = document.title === "Donate";

		// Create the new nav item.
		let newNavItem = document.createElement("li");

		// Set the inner HTML of the new nav item. Change it depending on if we're on the donate page or not.
		newNavItem.innerHTML = `
			<li class="nav-item">
				<a class="nav-link${isDonatePage ? '' : ""}" href="donate.html" id="donateNavLink"><i class="fa-solid fa-hand-holding-heart"></i> Donate</a>
			</li>`

		

		// Insert the new nav item to the end of the list.
		navBarListElement.insertBefore(newNavItem, navBarListElement.lastElementChild);
	}

    function DisplayContactList(){
        console.log("Display ContactList");

        if (localStorage.length > 0){
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);

            let index = 0;
            for (const key of keys){
                if(key.startsWith("contact_")){
                    let contactData = localStorage.getItem(key);

                    try{
                        let contact = new core.Contact();
                        contact.deserialize(contactData);

                        data += `<tr><th scope="row" class="text-center">${index}</th>
                        <td>${contact.fullName}</td>
                        <td>${contact.emailAddress}</td>
                        <td>${contact.subject}</td>
                        <td>${contact.message}</td>
                        <td class="text-center"> 
                            <button value="${key}" class="btn btn-warning btn-sm edit">
                                <i class="fa-solid fa-bolt"></i>
                                Edit
                            </button>
                        </td>
                        <td class="text-center">
                            <button value="${key}" class="btn btn-warning btn-sm delete">
                                <i class="fa-solid fa-user-minus"></i>
                                Delete
                            </button>
                        </td>
                        </tr>`;
                        index++;
                    }catch(error){
                        console.log("error deserializing contact data");
                    }
                }
            }
            contactList.innerHTML = data;
        }
        const addButton = document.getElementById("addContact");
        if (addButton){
            addButton.addEventListener("click", () => {
                location.href= "edit.html#add";
            });
        }

        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function(){

                if(confirm("Delete contact, are you sure?")){
                    localStorage.removeItem(this.value);
                    location.href= "contact-list.html";
                }

            })
        });

        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", function(){
                location.href= "edit.html#" + this.value;
            })
        })
    }

    function DisplaySignUpList(){
		console.log("Displaying Sign Up List");

        if (localStorage.length > 0){
            let signUpList = document.getElementById("signUpList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 0;

            for (const key of keys){
                let signUpData = localStorage.getItem(key);

                try{
                    if(key.startsWith("signUp_")) {
                        let signUp = new SignUp();
                        signUp.deserialize(signUpData);

                        data += `<tr><th scope="row" class="text-center">${index}</th>
                        <td>${signUp.fullName}</td>
                        <td>${signUp.emailAddress}</td>
                        <td>${signUp.preferredRole}</td>
                        </tr>`;
                        index++;
                    }
                }catch(error){
                    console.log("error deserializing contact data");
                }
            }
            signUpList.innerHTML = data;
        }
    }

    function DisplayHomePage(){
        console.log("Calling DisplayHomePage");
        let aboutUSBtn = document.querySelector("#AboutUsBtn");
        aboutUSBtn.addEventListener("click", function(){
            location.href="sign-up.html";
        })

        let MainContent = document.getElementsByTagName("main")[0];

        let mainParagraph = document.createElement("p");
        mainParagraph.setAttribute("id", "mainParagraph");
        mainParagraph.setAttribute("class", "mt-3");

        mainParagraph.textContent = "Welcome to volunteer connect! We pride ourselves on the " +
            "events that we host alongside our wonderful volunteers.";
        MainContent.appendChild(mainParagraph);
    }

    function DisplayAbout(){
        console.log("Calling DisplayAbout");
    }
    function DisplayEvents(){
        console.log("Calling DisplayEvents");

		// Generate the opportunities.
		generateOpportunities();

		// Create the calendar object.
		let calendar = new Calendar();
    }

    function DisplayOpportunities(){
        // generate opportunities
        generateOpportunities();

        let signUpBTN = getElementByIdSafe("signUpModalBTN");
        let modal = document.getElementById("signUpModalBody");
        signUpBTN.addEventListener("click", function(){
            console.log("victory");
            let signUp = new SignUp(document.getElementById("fullName").value,
                document.getElementById("emailAddress").value,
                document.getElementById("preferredRole").value);

            // Attempt to seraialize the sign up data.
            let serializedSignUp = signUp.serialize();

            if(serializedSignUp !== null){
                // The primary key if this table entry
                let Key = `signUp_${Date.now()}`;
                localStorage.setItem(Key, serializedSignUp);
                modal.textContent = "Thank you";
            } else {
                console.error("Failed to serialize sign up data.");
            }
        })

        console.log("Calling DisplayOpportunities");

        if (Opportunity.opportunities.length > 0){
            let data = "";
            let mainBody = getElementByIdSafe("opBody");

            for (let opportunityIndex = 0; opportunityIndex < Opportunity.opportunities.length; opportunityIndex++){

                try{
					let opportunity = Opportunity.opportunities[opportunityIndex];

					data += `<div class="card" style="width: 18rem;">
						<div class="card-body">
						<h5 class="card-title">${opportunity.title}</h5>
						<p class="card-text">${opportunity.description}, ${opportunity.date}</p>
						<a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signUpModal">Sign up</a>
						</div>
					</div>`;
                }catch(error){
                    console.log("error deserializing contact data");
                }
            }

            if(mainBody){
                mainBody.innerHTML = data;
            }
        }
    }
    function Home(){
        location.href="index.html";

    }
    function DisplayContact(){
        console.log("Calling DisplayContact");

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        let form = document.getElementById("contactForm");
        let wait;
        let sendButtonFeedback = document.getElementById("sendButtonFeedback");
        let feedbackForm = document.getElementById("feedbackForm");
        let feedbackModal = document.getElementById("feedbackModal");
        let feedbackModalBody = document.getElementById("feedbackModalBody");
        let span = document.getElementsByClassName("close")[0];


        sendButton.addEventListener("click", function(){
            event.preventDefault();

            if(subscribeCheckbox.checked){

                let contact = new core.Contact(document.getElementById("fullName").value,
                    document.getElementById("emailAddress").value,
                    document.getElementById("subject").value,
                    document.getElementById("message").value);
                if(contact.serialize()){
                    // The primary key if this table entry
                    let Key = `contact_${Date.now()}`;
                    localStorage.setItem(Key, contact.serialize());

                    form.innerHTML = `<div>Thanks for sending a message!</div>`;

                    `<a>data-bs-toggle="modal" data-bs-target="#submitModal"</a>`
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 5000);
                }

            }

        });
        sendButtonFeedback.addEventListener("click", function(event){
            let name = getElementByIdSafe("name").value;
            event.preventDefault();
            feedbackModal.style.display = "block";
            feedbackModalBody.innerHTML = `Thank you for giving us feedback ${name}, we will take it into consideration!`

        });
        span.onclick = function() {
            feedbackModal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target === feedbackModal) {
                feedbackModal.style.display = "none";
            }
        };
    }
    function DisplaySignUp(){
        console.log("Calling DisplaySignUp");

        let sendButton = getElementByIdSafe("sendButton");
        sendButton.addEventListener("click", function(){

            let signUp = new SignUp(document.getElementById("fullName").value,
                document.getElementById("emailAddress").value,
                document.getElementById("preferredRole").value);

			// Attempt to seraialize the sign up data.
			let serializedSignUp = signUp.serialize();

            if(serializedSignUp !== null){
                // The primary key if this table entry
                let Key = `signUp_${Date.now()}`;
                localStorage.setItem(Key, serializedSignUp);
            } else {
				console.error("Failed to serialize sign up data.");
			}
        });
    }

	/**
	 * Function for displaying the donate page.
	 */
	function DisplayDonate(){
		console.log("Calling DisplayDonate");
	}

    function generateOpportunities() {
        let event = new Opportunity(
			"Sally's BBQ",
			"A BBQ hosted from Sally's home selling burgers and hot dogs",
			new Date("2025-02-03T13:00:00"),
			OpportunityType.Fundraiser
		);
		event.latlng = new L.LatLng(43.952282644263164, -78.89666326883909);

        let event1 = new Opportunity(
			"Jim's cleanup",
			"A park cleanup hosted by Jim all are welcome",
			new Date("2025-02-03T11:00:00"),
			OpportunityType.Cleanup
		)
		
        let event2 = new Opportunity(
			"John's first aid training",
			"Learn from a paramedic what to do in an emergency",
			new Date("2025-02-12T18:00:00"),
			OpportunityType.Workshop
		)

		event2.latlng = new L.LatLng(43.83729352741549, -79.01701258061664);
    }

	/**
	 * Highlights the active page in the nav bar with the given id.
	 * 
	 * @param {string} pageId 
	 */
	function HighlightActivePage(pageId){
		// Attempt the find the page element.
		let pageElement = getElementByIdSafe(pageId + "NavLink");

		// If the page element is null, return.
		if(pageElement === null){
			return;
		}

		// Set the aria-current attribute to page.
		pageElement.setAttribute("aria-current", "page");

		// Add the active class to the page
		pageElement.classList.add("active");
	}

    async function Start(){
        console.log("Starting...");

        await LoadHeader().then( () => {
            CheckLogin()
            // Setup our dynamic nav bar.
            SetupDynamicNavBar();
            LoadSearch()
        });





        switch(document.title){
            case "Home":
                DisplayHomePage();
				HighlightActivePage("index");
                break;
            case "About":
                DisplayAbout();
				HighlightActivePage("about");
                break;
            case "Events":
                DisplayEvents();
				HighlightActivePage("events");
                break;
            case "Opportunities":
                DisplayOpportunities();
				HighlightActivePage("opportunities");
                break;
            case "Contact":
                DisplayContact();
				HighlightActivePage("contact");
                break;
            case "Contact List":
                DisplayContactList();
                break;
            case "Sign Up":
                DisplaySignUp();
                break;
            case "Sign Up List":
                DisplaySignUpList();
                break;
			case "Donate":
				HighlightActivePage("donate");
                break;
            case "Login":
                DisplayLogin();
                break;
            case "Edit Contact":
                DisplayEditContact();
                break;
            case "Gallery":
                DisplayGallery();
                break;
            default:
                console.error("Invalid Page.");

        }

    }window.addEventListener("DOMContentLoaded", () => {
        console.log("Dom fully loaded and parsed");
        Start();
    });

})();