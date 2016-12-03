/**
 * The route menu item
 *
 * @constructor
 * @extends      {Alchemy.MenuItem}
 *
 * @author       Jelle De Loecker   <jelle@develry.be>
 * @since        0.3.0
 * @version      0.3.0
 *
 * @param        {Object}     data             Item data as stored in DB
 * @param        {Document}   menu_document    Parent menu document
 */
var RouteItem = Function.inherits('Alchemy.AnchorMenuItem', function RouteMenuItem(data, menu_document) {
	RouteMenuItem.super.call(this, data, menu_document);
});

/**
 * Do not allow child items by defulat
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @type {Boolean}
 */
RouteItem.setProperty('allow_children', false);

/**
 * The view to use for generating the item
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @type {String}
 */
RouteItem.setProperty('view_name', 'menu/item');

/**
 * Set the menu item configuration schema
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 */
RouteItem.constitute(function setSchema() {

	// The route name to use
	this.schema.addField('route', 'String');

	// Route parameters
	this.schema.addField('parameters', 'Object');
});