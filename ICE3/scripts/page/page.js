"use strict";

import { router } from "../router.js"

export let Pages = {};

export class Page {
	constructor(name, path, onDisplay){
		this.name = name;
		this.path = path;
		this.onDisplay = onDisplay;

		Pages[name] = this;
	}
	navigateTo(hash = ""){
		router.navigate(this, hash);
	}
	display(hash = ""){
		this.onDisplay(hash);
	}
}