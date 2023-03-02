/**
 * The Menu Controller class
 *
 * @extends  Alchemy.Controller.App
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.5.0
 *
 * @param    {Conduit}   conduit
 * @param    {Object}    options
 */
const Menu = Function.inherits('Alchemy.Controller.App', 'Menu');

/**
 * Return menu information
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.0.1
 * @version  0.4.0
 */
Menu.setAction(function getMenu(conduit) {

	var data = conduit.body;

	this.getModel('Menu').get(data.name, function done(err, result) {

		if (err) {
			return conduit.error(err);
		}

		conduit.end(result);
	});
});

/**
 * Get a document for routing
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.3
 * @version  0.6.4
 */
Menu.setAction(async function getRouteDocument(conduit) {

	let route = conduit.param('route'),
	    model = conduit.param('model'),
	    pk = conduit.param('pk');

	if (!pk || !route || !model) {
		return conduit.end();
	}

	route = Router.routes.getDict()[route];

	if (!route?.param_definitions) {
		return conduit.end();
	}

	model = this.getModel(model);

	let doc = await model.findByPk(pk);

	if (!doc) {
		return conduit.end();
	}

	let result = {},
	    definition,
	    key;

	for (key in route.param_definitions) {
		definition = route.param_definitions[key];

		if (!definition.is_model_type) {
			continue;
		}

		let doc_value = Object.path(doc, definition.type_field_name);

		if (doc_value) {
			result[definition.name] = doc_value;
			result[definition.type_field_name] = doc_value;
		}
	}

	let breadcrumb = model.getField('breadcrumb');

	if (breadcrumb && !breadcrumb.is_private) {
		result.breadcrumb = doc.breadcrumb;
	}

	conduit.end(result);
});