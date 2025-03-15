"use strict";

import { Page, Pages } from "../page.js";

export const ProductsPage = new Page(
	"ProductsPage",
	"products",
	() => {}
);

Pages.ProductsPage = ProductsPage;