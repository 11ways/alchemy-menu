/**
 * The Route link class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.2
 */
const RouteLink = Function.inherits('Alchemy.Menu.Link', 'Route');

/**
 * Set the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.2
 */
RouteLink.constitute(function setSchema() {

	let routes;

	if (Blast.isNode) {
		routes = Router.routes.getDict();
	} else {

		routes = {};

		// for (let root in hawkejs.scene.exposed.routes) {
		// 	let section = hawkejs.scene.exposed.routes[root];

		// 	for (let key in section) {
		// 		routes[key] = section[key];
		// 	}
		// }
	}

	this.schema.addField('route', 'Enum', {
		values                 : routes,
		widget_config_editable : true,
	});

	let params = alchemy.createSchema();
	params.addField('name', 'String');
	params.addField('value', 'String');

	this.schema.addField('parameters', params, {array: true});
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
RouteLink.setMethod(function populateWidget(anchor, widget) {

	let parameters = {};

	if (Array.isArray(this.settings.parameters)) {
		let entry;

		for (entry of this.settings.parameters) {
			parameters[entry.name] = entry.value;
		}
	}

	widget.hawkejs_renderer.helpers.Router.applyDirective(anchor, this.settings.route, {
		parameters : parameters,
	});
	
});