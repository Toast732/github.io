"use strict";

import { router } from "../router"

export let Pages: { [id: string] : Page } = {};

export class Page {

	public name: string
	public path: string
	public onDisplay: { (hash?: string): void }

	constructor(name: string, path: string, onDisplay: { (hash?: string): void }){
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