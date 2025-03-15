"use strict";

import { Page, Pages } from "../page";

export const ProductsPage = new Page(
	"ProductsPage",
	"products",
	() => {}
);

Pages.ProductsPage = ProductsPage;