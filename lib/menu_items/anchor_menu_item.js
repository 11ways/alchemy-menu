/**
 * The anchor menu item:
 * Basis for any item that links to another page
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
var Anchor = Function.inherits('Alchemy.MenuItem', function AnchorMenuItem(data, menu_document) {
	AnchorMenuItem.super.call(this, data, menu_document);
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
Anchor.setProperty('allow_children', false);

/**
 * The view to use for generating the item
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @type {String}
 */
Anchor.setProperty('view_name', 'menu/item');

/**
 * Set the menu item configuration schema
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Anchor.constitute(function setSchema() {

	// The title of the link (as in tooltip)
	this.schema.addField('title', 'String', {translatable: true});

	// The text content (html escaped)
	this.schema.addField('text', 'String', {translatable: true});

	// The url to link to
	this.schema.addField('href', 'Url', {translatable: true});

	// Target enum values
	this.schema.addEnumValues('targets', {
		'_self'    : __('chimera', 'Current Frame'),
		'_blank'   : __('chimera', 'New Window'),
		'_parent'  : __('chimera', 'Parent Frame (or current)'),
		'_top'     : __('chimera', 'Current Tab')
	});

	this.schema.addField('target', 'Enum', {default: '_self'});
});