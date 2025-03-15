"use strict";

import { InjectHeader } from "./header.js";

import { Page, Pages } from "./page/page.js";

import { HTTP404Page } from "./page/pages/http404_page.js";

const RootPath = "views/pages/";

class Router {
	constructor() {
		this.routes = {};
	}

	navigate(page, hash){
		console.log(`Target: ${page.path + hash}`);
		location.hash = page.path + hash;
		this.loadRoute(page, hash);
	}

	buildPath(page){
		return RootPath + page.path + ".html";
	}

	loadRoute(page, hash){
		console.log(`[INFO] Loading route ${page.path}`);

		const basePath = this.buildPath(page).split("#")[0];

		// if(!this.routes[basePath]){
		// 	console.warn(`No.`);
		// 	location.hash = "/404";
		// }

		fetch(basePath)
			.then(response => {
				if(!response.ok){
					throw new Error(`Failed to load ${basePath}`);
				}

				return response.text();
			})
			.then(html => {
				document.querySelector("main").innerHTML = html;

				InjectHeader().then(() => {
					page.display(hash);
				})
				.catch(error => console.error(`Error loading page: ${error}`));
			})
	}
}

function UpdateNavigation(){
	// Get the hash.
	let hashFull = location.hash.slice(1)

	// Split by any remaining # characters.
	let hashArray = hashFull.split("#", 2);

	for(let pageName in Pages){
		// Get the page.
		let page = Pages[pageName];

		console.log(`${hashArray[0]} === ${page.path}`);

		// If the page path matches, set this as our page.
		if(hashArray[0] === page.path){
			// If we have a hash, give it it's # back.
			if(hashArray[1] !== undefined){
				hashArray[1] = "#" + hashArray[1];
			}

			page.navigateTo(hashArray[1]);
			return;
		}
	}

	console.log(`No match found for "${hashArray[0]}" Navigating to the 404 page.`)
	// If we're here, we failed to get to a page. Navigate to our 404 page as a fallback.
	HTTP404Page.navigateTo();
}

// Whenever the pathhash changes, we want to try to navigate.
window.addEventListener("hashchange", UpdateNavigation);
window.addEventListener("popstate", UpdateNavigation);
window.addEventListener("DOMContentLoaded", UpdateNavigation);

export let router = new Router();