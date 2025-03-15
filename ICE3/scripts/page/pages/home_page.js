"use strict";

import { Page, Pages } from "../page.js";
import { AboutPage } from "./about_page.js";
import { getElementByIdSafe } from "../../html_utilities.js";


export const HomePage = new Page(
	"HomePage",
	"home",
	() => {
		const main = document.querySelector("main");

		// main.innerHTML = "";

		// main?.insertAdjacentHTML(
		// 	"beforeend",
		// 	`<button id="AboutUsBtn" class="btn btn-primary">About Us</button>
		// 	<div id="weather" class="mt-5"><h3>Weather Information</h3><p id="weather-data">Fetching weather data...</p></div>
		// 	<p id="MainParagraph" class="mt-5">This is my main paragraph</p>
		// 	<article class="container">
		// 		<p id="ArticleParagraph" class="mt-3">
		// 			This is my Article Paragraph
		// 		</p>
		// 	</article>
		// 	`
		// );

		DisplayWeather();

        const aboutUsButton = getElementByIdSafe("AboutUsBtn");

		// Arrow Notation.
        aboutUsButton.addEventListener("click", () => {
			console.log("AAA");
			// Navigate to the path.
            AboutPage.navigateTo();
        });
	}
)

async function DisplayWeather() {
	const apiKey = "57eb50039797b44f4ca2a304798d0b09";

	const city = "Oshawa";

	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

	try {
		const response = await fetch(url);

		if(!response.ok){
			throw new Error("Failed to fetch wether data from openweathermap.org.")
		}

		const data = await response.json();

		console.log("Weather API Response", data);

		const weatherDataElement = getElementByIdSafe("weather-data");

		weatherDataElement.innerHTML = `<strong>City:</strong> ${data.name}<br><strong>Temperature:</strong> ${data.main.temp}<br><strong>Weather:</strong> ${data.weather[0].description}`;
	} catch (error) {
		console.error("Error fetching weather data", error);
		getElementByIdSafe("weather-data").textContent = "Unable to contact weather data at this time";
	}
}

Pages.HomePage = HomePage;