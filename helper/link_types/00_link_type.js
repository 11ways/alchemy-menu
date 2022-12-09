/**
 * The Link type class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.2
 *
 * @param    {Object}   settings
 */
const LinkType = Function.inherits('Alchemy.Base', 'Alchemy.Menu.Link', function Link(settings) {
	this.settings = settings || {};
});

/**
 * Make this an abtract class
 */
LinkType.makeAbstractClass();

/**
 * This class starts a new group
 */
LinkType.startNewGroup('al_menu_link_types');

/**
 * Get the type_name from the constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.2
 */
LinkType.setProperty(function type_name() {
	return this.constructor.type_name;
});

/**
 * Return the class-wide schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.2
 *
 * @type   {Schema}
 */
LinkType.setProperty(function schema() {
	return this.constructor.schema;
});

/**
 * Set the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.2
 */
LinkType.constitute(function setSchema() {
	// Create a new schema
	let schema = alchemy.createSchema();
	this.schema = schema;
});

/**
 * Populate a link widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.2
 *
 * @param    {HTMLAnchorElement}   anchor
 * @param    {Alchemy.Widget.Link} widget
 */
LinkType.setAbstractMethod('populateWidget');