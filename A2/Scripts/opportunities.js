"use strict"

/**
 * Represents a type of opportunity.
 */
class OpportunityType {

	static types = [];

	static Fundraiser = new OpportunityType("Fundraiser", "#87FFAC");
	static Workshop = new OpportunityType("Workshop", "#FFE687");
	static Cleanup = new OpportunityType("Cleanup", "#878FFF");

	/**
	 * Defines a new opportunity type, with a name, and a colour.
	 * 
	 * @param {string} name 
	 * @param {string} colour 
	 */
	constructor(name, colour) {
		this._name = name;
		this._colour = colour;

		OpportunityType.types.push(this);
	}

	/**
	 * Gets the name of the opportunity type.
	 * 
	 * @returns {string} The name of the opportunity
	 */
	get name(){
		return this._name;
	}

	/**
	 * Gets the colour of the opportunity type.
	 * 
	 * @returns {string} The colour of the opportunity
	 */
	get colour() {
		return this._colour;
	}
}

/**
 * Represents an opportunity.
 */
class Opportunity {

	static opportunities = [];

	/**
	 * @param {string} title The title of the opportunity.
	 * @param {string} description The description of the opportunity.
	 * @param {Date} date The date of the opportunity
	 * @param {OpportunityType} type The type of the opportunity.
	 */
    constructor(title="", description="", date=new Date(), type=OpportunityType.Fundraiser) {
        this._title = title;
        this._description = description;
        this._date = date;
		this._type = type;

		// Add ourselves to the list of opportunities.
		Opportunity.opportunities.push(this);

		// Sort the opportunities by date. Where the newest opportunities are at the end, as our calendar inserts them in reverse order.
		Opportunity.opportunities.sort((a, b) => a.dateParsed + b.dateParsed);
    }

	/**
	 * The lat and lng of this event, if it's not set, then it will return undefined.
	 * 
	 * @returns {L.LatLng|undefined}
	 */
	get latlng(){
		return this._latlng
	}

	/**
	 * The lat and lng of this event
	 * 
	 * @param {L.LatLng} latlng
	 */
	set latlng(latlng){
		this._latlng = latlng;
	}

    get title() {
        return this._title;
    }

    set title(title) {
        this._title = title;
    }

    get description() {
        return this._description;
    }

    set description(description) {
        this._description = description;
    }

	/**
	 * Gets the date as a string.
	 * 
	 * @returns {string} The date as a string (Month, Day, Time)
	 */
    get date() {
        return `${this._date.toLocaleString('default', { month: 'long' })} ${this._date.getDate()} ${this._date.toLocaleTimeString()}`;
    }

	/**
	 * Gets the date parsed as a date object.
	 * 
	 * @returns {Date} The date parsed as a date object.
	 */
	get dateParsed() {
		return new Date(this._date);
	}

	/**
	 * @param {Date} date The date of the opportunity.
	 */
    set date(date) {
        this._date = date;
    }

	/**
	 * Gets the type of the opportunity.
	 * 
	 * @returns {OpportunityType} The type of the opportunity.
	 */
	get type() {
		return this._type;
	}

	/**
	 * @param {OpportunityType} type The type of the opportunity.
	 */
	set type(type) {
		this._type = type;
	}
}
