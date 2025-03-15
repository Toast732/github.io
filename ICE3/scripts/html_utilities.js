// A safe version of getElementByID, which will print an error if it fails to find the element.
/** @returns {HTMLElement | null | any} */
export function getElementByIdSafe(id) {
	// Attempt to get the element.
	let element = document.getElementById(id);

	// If it's null, print an error.
	if(element === null){
		console.error(`Failed to find element with ID: ${id}`);
	}

	// Return the element.
	return element;
}