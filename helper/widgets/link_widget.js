/**
 * The Widget Link class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const Link = Function.inherits('Alchemy.Widget', 'Link');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Link.constitute(function prepareSchema() {

	this.schema.addField('href', 'String');

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

	this.schema.addField('route', 'Enum', {values: routes});

	let params = this.createSchema();
	params.addField('name', 'String');
	params.addField('value', 'String');

	this.schema.addField('parameters', params, {array: true});

	this.schema.addField('content', 'String', {translatable: true});
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   widget
 */
Link.setMethod(function populateWidget() {

	populateWidget.super.call(this);

	let anchor = this.createElement('a'),
	    href;

	if (this.config.href) {
		href = this.config.href;
	} else if (this.config.route) {

		let parameters = {};

		if (Array.isArray(this.config.parameters)) {
			let entry;

			for (entry of this.config.parameters) {
				parameters[entry.name] = entry.value;
			}
		}

		href = alchemy.routeUrl(this.config.route, parameters);
	} else {
		href = '#';
	}

	anchor.setAttribute('href', href);

	if (this.config.content) {
		anchor.textContent = this.config.content;
	}

	this.widget.append(anchor);
});

/**
 * Things to do when the widget is being edited
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   widget
 */
Link.setMethod(function _startEditor() {

	if (this.widget._has_edit_events) {
		return;
	}

	this.widget._has_edit_events = true;

	this.widget.addEventListener('click', e => {
		if (this.editing) {
			e.preventDefault();
		}
	});
});