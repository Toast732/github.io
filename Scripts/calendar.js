"use strict"

/*
	Class meant to store a stored opportunity, which includes the opportunity element, and it's opportunity definition.
*/
class StoredCalendarOpportunity {
	/**
	 * Constructs a new stored calendar opportunity.
	 * 
	 * @param {HTMLElement} element The opportunity element.
	 * @param {Opportunity} opportunity The opportunity definition.
	 */
	constructor(element, opportunity) {
		this._element = element;
		this._opportunity = opportunity;
	}

	/**
	 * Gets the opportunity element.
	 * 
	 * @returns {HTMLElement} The opportunity element.
	 */
	get element() {
		return this._element;
	}

	/**
	 * Gets the opportunity definition.
	 * 
	 * @returns {Opportunity} The opportunity definition.
	 */
	get opportunity() {
		return this._opportunity;
	}
}

/*
	Creates a calendar, and displays it on the page.
 */
class Calendar {

	// The number of rows in the calendar, which is at most 6, however, we check if the final row is empty, and if it is, we don't add it.
	static CALENDAR_ROWS = 6;
	/**
	 * Constructs a new calendar instance.
	 */
	constructor() {
		// Get the grid element
		this._calendarElement = document.getElementById("calendar-grid");

		// Store the opportunities. Indexed by their opportunity type, which is then a list of opportunities.
		this._opportunities = {};

		// If the calendar element does not exist, throw an error.
		if (!this._calendarElement) {
			throw new Error("Calendar grid element not found!");
		}

		// Set the date of the calendar to our current date.
		this.setDate(new Date());

		// If date is not set, throw an error.
		if (!this._date) {
			throw new Error("Date not set!");
		}

		// Add an event for when the window resizes, to update the column widths.
		window.addEventListener("resize", () => this.updateColumnWidths());

		// Get the go back a month button.
		let prevMonthButton = document.getElementById("prevMonthButton");

		// If the previous month button does not exist, throw an error.
		if (!prevMonthButton) {
			throw new Error("Previous month button not found!");
		}

		// Add an event listener for the previous month button.
		prevMonthButton.addEventListener("click", () => 
			this.setDate(
				this.getDateRelative(-1)
			)
		);

		// Get the next month button.
		let nextMonthButton = document.getElementById("nextMonthButton");

		// If the next month button does not exist, throw an error.
		if (!nextMonthButton) {
			throw new Error("Next month button not found!");
		}

		// Add an event listener for the next month button.
		nextMonthButton.addEventListener("click", () => 
			this.setDate(
				this.getDateRelative(1)
			)
		);

		/**
		 * Setup the filters.
		*/

		// Create our filter states.
		this._filterStates = {};
		
		// Get the filter frame element.
		let filterFrame = document.getElementById("filter-frame");

		// If the filter frame does not exist, throw an error.
		if (!filterFrame) {
			throw new Error("Filter frame not found!");
		}

		// Go through each opportunity type.
		for (let opportunityTypeIndex = 0; opportunityTypeIndex < OpportunityType.types.length; opportunityTypeIndex++){
			// Get the type.
			let type = OpportunityType.types[opportunityTypeIndex];

			// Create the filter element.
			let filterElement = document.createElement("input");

			// Set it's type to a checkbox.
			filterElement.type = "checkbox";

			// Set it to be checked.
			filterElement.checked = true;

			// Set the autocomplete attribute to off.
			filterElement.autocomplete = "off";

			// Set the class.
			filterElement.className = "btn-check pl-2 ml-2 active";

			// Create the ID name.
			let filterElementId = `filter-${type.name}`;

			// Set the id.
			filterElement.id = filterElementId;

			// Add the element to the filter frame.
			filterFrame.appendChild(filterElement);

			// Create the label element.
			let labelElement = document.createElement("label");

			// Set the class.
			labelElement.className = "btn pl-2 ml-2";

			// Set the colour of the border of the label.
			labelElement.style.borderColor = type.colour;

			// Set the border width.
			labelElement.style.borderWidth = "2px";

			// Set the for attribute.
			labelElement.htmlFor = filterElementId;

			// Set the text content.
			labelElement.textContent = type.name;

			// Add the label element to the filter frame.
			filterFrame.appendChild(labelElement);

			// Add an event listener for when it's clicked.
			filterElement.addEventListener("click", () => {
				this._onFilterClicked(type, labelElement, filterElement.checked);
			});

			// Check if this opportunity type list has been initialized.
			if (typeof(this._opportunities[type.name]) === "undefined") {
				// If it has not, initialize it.
				this._opportunities[type.name] = [];
			}

			// Invoke the filter clicked event, to update their colours.
			this._onFilterClicked(type, labelElement, filterElement.checked);
		}
	}

	/**
	 * Loads an opportunity to the calendar.
	 * 
	 * @param {Opportunity} opportunity The opportunity to load.
	 */
	loadOpportunity(opportunity){
		// Get the date as a date object from the opportunity.
		let opportunityDate = opportunity.dateParsed;

		// If our data is not set, throw an error
		if(!this._date || !this._dataColumns){
			throw new Error("Calendar is not setup! Some of the data is missing!");
		}

		// If the opportunity date is not within our month, skip it.
		if (opportunityDate.getMonth() !== this._date.getMonth()) {
			// Print the opportunity date.
			console.log(`Skipping Opportunity: ${opportunity.title}, as it's month ${opportunityDate.getMonth()} is not the same as the calendar's month ${this._date.getMonth()}`);
			return;
		}

		// Get the first day of the month.
		let firstDayDate = new Date(this._date.getFullYear(), this._date.getMonth(), 1);

		// Get the first day of the month as it's day of the week.
		let firstDayWeekIndex = firstDayDate.getDay();

		// Get the day of the month this opportunity falls on.
		let dayOfTheMonth = opportunityDate.getDate() + firstDayWeekIndex - 1;

		// Get the column index for this day.
		let columnIndex = dayOfTheMonth % 7;

		// Get the row index for this day.
		let rowIndex = Math.floor(dayOfTheMonth / 7);

		// Create the opportunity element.
		let opportunityElement = document.createElement("div");

		// Set it's class.
		opportunityElement.className = `opportunity border rounded p-1 ${opportunity.type.name}`;

		// Set it's style to our desired colour for our given opportunity type.
		opportunityElement.style.backgroundColor = opportunity.type.colour;

		// Set the text content.
		opportunityElement.textContent = opportunity.title;

		// Get the cell.
		let cell = this._dataColumns[columnIndex][rowIndex];

		// Add the opportunity element to the top of the cell.
		cell.insertBefore(opportunityElement, cell.firstChild);

		// Create the stored opportunity object.
		let storedOpportunity = new StoredCalendarOpportunity(
			opportunityElement,
			opportunity
		);

		// Add the opportunity to our list of opportunities.
		this._opportunities[opportunity.type.name].push(storedOpportunity);

		// Update the hidden state of the opportunity.
		this._updateOpportunityVisibility(storedOpportunity);
	}

	/**
	 * Gets the date relative to the month of the current one set (eg: 0 returns same month, 1 provides next month, -1 provides previous month).
	 * 
	 * @param {number} monthOffset the month offset.
	 * @returns {Date} The date.
	 */
	getDateRelative(monthOffset){
		// Get our currently set date.
		let date = this._date;

		// If this._date is undefined, set it to our current date.
		if (!date) {
			date = new Date();
		}

		// If the month offset is 0, return the current date.
		if (monthOffset === 0) {
			return date;
		}

		// Otherwise, return the date with the month offset.
		return new Date(date.getFullYear(), date.getMonth() + monthOffset, 1);
	}

	/**
	 * Sets the date of the calendar. Resets all fields too.
	 * 
	 * @param {Date} date The date to set the calendar to.
	 */
	setDate(date){

		// Set the date.
		this._date = date;

		// Destroy all of the children on calendar grid, except for the first row.
		for(let rowIndex = this._calendarElement.childElementCount - 1; rowIndex >= 1; rowIndex--) {
			// Get the row.
			let row = this._calendarElement.children[rowIndex];

			console.log(typeof(row));

			// Remove the row.
			this._calendarElement.removeChild(row);
		}

		// Define & reset the columns.
		this._dataColumns = [];

		// Initialize the columns
		for(let columnIndex = 0; columnIndex < 7; columnIndex++) {
			this._dataColumns[columnIndex] = [];
		}

		// Draw the calendar's days.
		this._drawCalendarDays();

		// Add the opportunities to the calendar.
		for (let opportunityIndex = 0; opportunityIndex < Opportunity.opportunities.length; opportunityIndex++) {
			// Load the opportunity to the calendar.
			this.loadOpportunity(Opportunity.opportunities[opportunityIndex]);
		}
	}

	/**
	 * Updates the column widths for the calendar, syncing it with the header.
	 * 
	 * This is to avoid the widths randomly becoming out of sync, which occurs often for smaller screen sizes.
	 */
	updateColumnWidths() {
		// Get the header row.
		let headerRow = document.getElementById("calendar-header-row");

		// If the header row doesn't exist, return.
		if (!headerRow) {
			console.error("Header row not found!");
			return;
		}

		// For each element in each column, update their width.
		for(let columnIndex = 0; columnIndex < 7; columnIndex++) {
			// Get the header column.
			let headerColumn = headerRow.children[columnIndex];

			// Get the data column.
			let dataColumn = this._dataColumns[columnIndex];

			// Get the desired width.
			let desiredWidth = Math.floor(headerColumn.clientWidth) + "px";

			// Go through each cell in the data column, and set their width.
			for(let rowIndex = 0; rowIndex < Calendar.CALENDAR_ROWS; rowIndex++) {
				// Get the cell.
				let cell = dataColumn[rowIndex];

				// Set the width of the data column to the width of the header column.
				cell.style.width = desiredWidth;
				cell.style.maxWidth = desiredWidth;
			}
		}

		console.log("Resized columns!");
	}

	/**
	 * Called whenever a filter checkbox is clicked.
	 * 
	 * @param {OpportunityType} type The type of opportunity type of the button that was clicked.
	 * @param {HTMLElement} label The label for the checkbox.
	 * @param {boolean} checked the new checked state of the button.
	 */
	_onFilterClicked(type, label, checked) {
		// If the filter is checked, show the type, otherwise, hide it.
		if (checked) {
			// Set our background to our colour.
			label.style.backgroundColor = `${type.colour}dd`;
		} else {
			// Set our background colour to default.
			label.style.backgroundColor = `${type.colour}33`;
			//this.hideType(type);
		}

		// Set our new filter state.
		this._filterStates[type.name] = checked;

		// Go through each opportunity of this type, and update their visibility.
		for(let opportunityIndex = 0; opportunityIndex < this._opportunities[type.name].length; opportunityIndex++){
			// Update the visibility of the opportunity.
			this._updateOpportunityVisibility(this._opportunities[type.name][opportunityIndex]);
		}
	}

	/**
	 * Updates the visibility of an opportunity based upon it's current filter state.
	 * 
	 * @param {StoredCalendarOpportunity} storedOpportunity
	 */
	_updateOpportunityVisibility(storedOpportunity){
		// Check if this filter is checked.
		let checked = this._filterStates[storedOpportunity.opportunity.type.name];

		// Update the visibility of the opportunity.
		storedOpportunity.element.style.display = checked ? "block" : "none";
	}

	/** 
	 * Draws the days onto the calendar, adding the rows and such.
	 */
	_drawCalendarDays() {
		// Get the first day of the month.
		let firstDayDate = new Date(this._date.getFullYear(), this._date.getMonth(), 1);

		// Get the last day of the month.
		let lastDayDate = new Date(this._date.getFullYear(), this._date.getMonth() + 1, 0);

		// Get the first day of the month as it's day of the week.
		let firstDayWeekIndex = firstDayDate.getDay();

		// Get the year month element
		let yearMonthElement = document.getElementById("yearMonthLabel");

		// Set the text content of the year month element.
		yearMonthElement.textContent = `${firstDayDate.toLocaleString('default', { month: 'long' })} ${firstDayDate.getFullYear()}`;

		for (let rowIndex = 0; rowIndex < Calendar.CALENDAR_ROWS; rowIndex++) {
			// Create the row
			let row = document.createElement("div");

			// Set it's class.
			row.className = "row calendar-row calendar-date-row flex-nowrap";

			// Store if there's any active cells.
			let hasActiveCells = false;

			for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
				// Create the cell.
				let cell = document.createElement("div");

				// Set the class.
				cell.className = "col calendar-column position-relative";

				// Add the cell to this row.
				row.appendChild(cell);

				// Add the date to our storage.
				this._addDate(cell, columnIndex)

				// Get the day of the month.
				let dayOfTheMonth = rowIndex * 7 + columnIndex - firstDayWeekIndex + 1;

				// If this is before the first day of the month, or after the last day of the month, continue.
				if(dayOfTheMonth < 1 || dayOfTheMonth > lastDayDate.getDate()) {

					// First, set this as inactive.
					cell.classList.add("inactive");

					// Then continue.
					continue;
				}

				// Create a div text element.
				let dayOfTheMonthElement = document.createElement("div");
				
				// Set the class.
				dayOfTheMonthElement.className = "position-absolute bottom-0 end-0 p-1";

				// Set the text content.
				dayOfTheMonthElement.textContent = dayOfTheMonth.toString();

				// Add the day of the month to the cell.
				cell.appendChild(dayOfTheMonthElement);

				// Set that we have active cells.
				hasActiveCells = true;
			}

			// If we don't have any active cells, break.
			if (!hasActiveCells) {
				break;
			}

			// Add the row to the calendar.
			this._calendarElement.appendChild(row);
		}

		// Update the width of the columns.
		this.updateColumnWidths();
	}

	/**
	 * Adds a new date to the calendar, used to store into our  columns.
	 * @param {HTMLElement} element The element to add.
	 * @param {number} columnIndex The column index.
	 */
	_addDate(element, columnIndex){

		// Add the element to the column.
		this._dataColumns[columnIndex].push(element);
	}
}