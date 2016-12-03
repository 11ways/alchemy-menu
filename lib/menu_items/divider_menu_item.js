/**
 * The divider menu item
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
var Divider = Function.inherits('Alchemy.MenuItem', function DividerMenuItem(data, menu_document) {
	DividerMenuItem.super.call(this, data, menu_document);
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
Divider.setProperty('allow_children', false);

/**
 * The view to use for generating the item
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @type {String}
 */
Divider.setProperty('view_name', 'menu/item');

/**
 * Set the menu item configuration schema
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Divider.constitute(function setSchema() {
	this.schema.addField('title', {translatable: true});
});