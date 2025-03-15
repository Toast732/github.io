"use strict";

import { Page, Pages } from "../page.js";

export const HTTP404Page = new Page(
	"404Page",
	"404",
	() => {}
);

Pages.HTTP404Page = HTTP404Page;