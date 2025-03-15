// A safe version of getElementByID, which will print an error if it fails to find the element.
/** @returns {HTMLElement | null | any} */
export function getElementByIdSafe(id: string): HTMLElement | null | any {
	// Attempt to get the element.
	let element = document.getElementById(id);

	// If it's null, print an error.
	if(element === null){
		console.error(`Failed to find element with ID: ${id}`);
	}

	// Return the element.
	return element;
}

// A safe version of getElementByID, which will print an error if it fails to find the element.
/** @returns {HTMLElement | null | any} */
export function querySelectorSafe(selectors: string): HTMLElement | null | any {
	// Attempt to get the element.
	let element = document.querySelector(selectors);

	// If it's null, print an error.
	if(element === null){
		console.error(`Failed query select element with Selectors: ${selectors}`);
	}

	// Return the element.
	return element;
}