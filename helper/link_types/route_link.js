const ROUTES_PROVIDER = alchemy.getRoutes();

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
 * @version  0.6.3
 */
RouteLink.constitute(function setSchema() {

	this.schema.addField('route', 'Enum', {
		values                 : ROUTES_PROVIDER,
		widget_config_editable : true,
	});

	this.schema.addField('parameters', 'Schema', {
		schema : 'route',
	});

	let params = alchemy.createSchema();
	params.addField('name', 'String');
	params.addField('value', 'String');

	this.schema.addField('parameter_overrides', params, {array: true});
});

/**
 * Populate a link widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.2
 * @version  0.6.5
 *
 * @param    {HTMLAnchorElement}   anchor
 * @param    {Alchemy.Widget.Link} widget
 */
RouteLink.setMethod(async function populateWidget(anchor, widget) {

	const route_name = this.settings?.route;

	if (!route_name) {
		return;
	}

	let route = ROUTES_PROVIDER.get(route_name);

	if (!route) {
		return;
	}

	let parameters = {};

	let schema = route.schema || route.value?.schema;

	if (Array.isArray(this.settings.parameters)) {
		let entry;

		for (entry of this.settings.parameters) {
			parameters[entry.name] = entry.value;
		}
	}

	let breadcrumb;

	if (schema) {

		let field;

		for (field of schema) {

			if (field?.options?.alias) {

				if (parameters[field.options.alias]) {
					continue;
				}

				let record;

				if (Blast.isNode) {
					const model = this.getModel(field.options.model_name);
					record = await model.findByPk(this.settings.parameters[field.name]);
				} else {
					record = await alchemy.fetch('Menu#getRouteDocument', {
						parameters: {
							route : route_name,
							model : field.options.model_name,
							pk    : this.settings.parameters[field.name],
						}
					});
				}

				if (record) {
					parameters[field.options.alias] = record;
					breadcrumb = record.breadcrumb;
				}
			} else if (this.settings.parameters[field.name]) {
				parameters[field.name] = this.settings.parameters[field.name];
			}
		}
	}

	if (Array.isArray(this.settings.parameter_overrides)) {
		let entry;

		for (entry of this.settings.parameter_overrides) {
			parameters[entry.name] = entry.value;
		}
	}

	widget.hawkejs_renderer.helpers.Router.applyDirective(anchor, route_name, {
		parameters : parameters,
		breadcrumb : breadcrumb,
	});
});