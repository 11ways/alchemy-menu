/**
 * The Href link class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.2
 */
const HrefLink = Function.inherits('Alchemy.Menu.Link', 'Href');

/**
 * Set the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.2
 */
HrefLink.constitute(function setSchema() {

	this.schema.addField('href', 'String', {
		description: 'The actual href to use',
	});

	this.schema.addField('breadcrumb', 'String', {
		description: 'The breadcrumb in case it\'s a local link',
	});
});

/**
 * Populate a link widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.6
 *
 * @param    {HTMLAnchorElement}   anchor
 * @param    {Alchemy.Widget.Link} widget
 */
HrefLink.setMethod(function populateWidget(anchor, widget) {
	anchor.setAttribute('href', this.settings.href || '');

	if (this.settings.breadcrumb) {
		anchor.setAttribute('data-breadcrumb', this.settings.breadcrumb);
	}

	if (this.settings.target) {
		anchor.setAttribute('target', this.settings.target);
	}
});