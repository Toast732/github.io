/**
 * Authors: Devon O'brien, and Liam Matthews.
 * File Name: main.js
 * Date: 2025-01-25
 * Description:
 * 	This is the main file to handle the site, which helps direct which code should be ran depending on what page the
 * 		user is on, and additionally has some of it's own code for handling some pages.
 */


"use strict";

//IIFE = Immediately invoked function expression
(function () {

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
                        let contact = new Contact();
                        contact.deserialize(contactData);

                        data += `<tr><th scope="row" class="text-center">${index}</th>
                        <td>${contact.fullName}</td>
                        <td>${contact.emailAddress}</td>
                        <td>${contact.subject}</td>
                        <td>${contact.message}</td>
                        </tr>`;
                        index++;
                    }catch(error){
                        console.log("error deserializing contact data");
                    }
                }

            }
            contactList.innerHTML = data;
        }
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
            let signUp = new SignUp(fullName.value, emailAddress.value, preferredRole.value);

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

        sendButton.addEventListener("click", function(){
            event.preventDefault();

            if(subscribeCheckbox.checked){

                let contact = new Contact(fullName.value, emailAddress.value, subject.value, message.value);
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
    }
    function DisplaySignUp(){
        console.log("Calling DisplaySignUp");

        let sendButton = getElementByIdSafe("sendButton");
        sendButton.addEventListener("click", function(){

            let signUp = new SignUp(fullName.value, emailAddress.value, preferredRole.value);

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

    function Start(){
        console.log("Starting...");

		// Setup our dynamic nav bar.
		SetupDynamicNavBar();



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
            default:
                console.error("Invalid Page.");

        }

    }window.addEventListener("load", Start)

})();