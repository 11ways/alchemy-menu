var MenuItemTypes = alchemy.shared('Menu.itemTypes');

/**
 * The Menu Manager Controller class
 *
 * @author        Jelle De Loecker   <jelle@codedor.be>
 * @since         1.0.0
 * @version       1.0.0
 */
var Menu = Function.inherits('EditorChimeraController', function MenuManagerChimeraController(conduit, options) {

	MenuManagerChimeraController.super.call(this, conduit, options);

});

/**
 * The edit action
 *
 * @param   {Conduit}   conduit
 */
Menu.setMethod(function edit(conduit) {

	var that = this,
	    modelName = conduit.routeParam('subject'),
	    model = Model.get(modelName),
	    chimera = model.behaviours.chimera,
	    id = conduit.routeParam('id'),
	    types = {},
	    key;

	var actionFields = chimera.getActionFields('edit'),
	    groups = actionFields.groups.clone();

	for (key in MenuItemTypes) {
		types[key] = MenuItemTypes[key].prototype.title;
	}
console.log(types)
	model.find('first', {conditions: {_id: alchemy.castObjectId(id)}}, function(err, items) {

		if (err) {
			return conduit.error(err);
		}

		if (!items.length) {
			return conduit.notFound();
		}

		that.set('actions', that.getActions());
		that.set('modelName', modelName);
		that.set('pageTitle', modelName.humanize());
		that.set('menuItem', items[0]);
		that.set('menuTypes', types);
		that.internal('modelName', modelName);
		that.internal('recordId', id);

		that.render('chimera/menu/edit');
	});
});

/**
 * Action to configure a single menu piece
 *
 * @param   {Conduit}   conduit
 */
Menu.setMethod(function configure(conduit) {

	var that = this,
	    modelName = conduit.routeParam('subject'),
	    model = Model.get(modelName),
	    chimera = model.behaviours.chimera,
	    id = conduit.routeParam('id');

	var actionFields = chimera.getActionFields('edit'),
	    groups = actionFields.groups.clone();

	model.find('first', {conditions: {_id: alchemy.castObjectId(id)}}, function(err, items) {

		if (err) {
			return conduit.error(err);
		}

		if (!items.length) {
			return conduit.notFound();
		}

		actionFields.processRecords(model, items, function groupedRecords(err, groups) {

			if (err) {
				return conduit.error(err);
			}

			that.set('groups', groups);
			that.set('actions', that.getActions());
			that.set('modelName', modelName);
			that.set('pageTitle', modelName.humanize());
			that.internal('modelName', modelName);
			that.internal('recordId', id);

			that.render('chimera/menu/configure_piece');
		});
	});
});

Menu.setMethod(function save_piece(conduit) {

	var that = this,
	    actionFields,
	    modelName,
	    chimera,
	    options,
	    groups,
	    record,
	    model,
	    data,
	    id;

	if (conduit.method != 'post') {
		return conduit.error('Use POST method to apply changes');
	}

	modelName = conduit.routeParam('subject');
	model = Model.get(modelName);

	chimera = model.behaviours.chimera;
	data = conduit.body.data;
	id = conduit.routeParam('id');

	actionFields = chimera.getActionFields('edit');
	groups = actionFields.groups.clone();

	record = data[modelName.classify()];
	record._id = alchemy.castObjectId(id);

	options = {};

	// Force create, even though an _id could be given
	if (conduit.body.create === true) {
		options.create = true;
	}

	model.save(record, options, function afterSave(err, result) {

		if (err != null) {
			return conduit.error(err);
		}

		that.configure(conduit);
	});
});