/**
 * The abstract menu item class
 *
 * @constructor
 * @extends      {Alchemy.Base}
 *
 * @author       Jelle De Loecker   <jelle@develry.be>
 * @since        0.3.0
 * @version      0.3.0
 *
 * @param        {Object}     data             Item data as stored in DB
 * @param        {Document}   menu_document    Parent menu document
 */
var Item = Function.inherits('Alchemy.Base', function MenuItem(data, menu_document) {

	// The data of this item
	this.data = data || {};

	// The parent menu document
	this.menu_document = menu_document;
});

/**
 * This is an abstract class
 *
 * @type {Boolean}
 */
Item.setProperty('is_abstract_class', true);

/**
 * This class starts a new group
 *
 * @type {Boolean}
 */
Item.setProperty('starts_new_group', true);

/**
 * Do not allow child items by defulat
 *
 * @type {Boolean}
 */
Item.setProperty('allow_children', false);

/**
 * The view to use for generating the item
 *
 * @type {String}
 */
Item.setProperty('view_name', 'menu/item');

/**
 * The description of this item
 *
 * @type {String}
 */
Item.setProperty('description', '');

/**
 * Return the class-wide schema
 *
 * @type   {Schema}
 */
Item.setProperty(function schema() {
	return this.constructor.schema;
});

/**
 * Set the block configuration schema
 * (This schema is used in the widget model)
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Item.constitute(function setSchema() {

	var schema;

	// Create a new schema
	schema = new Classes.Alchemy.Schema(this);

	// Each item can have decoration settings
	schema.addField('decoration', 'Object');

	// Each item can have a breadcrumb set
	schema.addField('breadcrumb', 'String');

	// Store the schema on the class constructor
	this.schema = schema;
});

/**
 * Return JSON data
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @return   {Object}
 */
Item.setMethod(function toJSON() {

	var result,
	    doc = this.document;

	result = {
		id             : doc.id,
		type           : doc.type,
		parent         : doc.parent,
		settings       : doc.settings || {},
		allow_children : this.allow_children,
		view_name      : this.view_name
	};

	return result;
});

/**
 * Build this menu piece
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.1
 * @version  0.3.0
 *
 * @param    {Function} callback   The function to call back
 */
Item.setMethod(function configure(callback) {

	var that = this;

	// Configure the item
	this._configure(function configured(err) {

		if (err) {
			return callback(err);
		}

		// Callback with a reference to this item,
		// for `Function.parallel` and `next` stuff
		callback(null, that);
	});
});

/**
 * Do the configuration
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.1
 * @version  0.3.0
 *
 * @param    {Object}   data       The menu item record data from the db
 * @pram     {Object}   settings   The copied settings
 * @param    {Function} callback   The function to call back
 */
Item.setMethod(function _configure(callback) {
	callback(null);
});