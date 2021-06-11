var MenuItemTypes = alchemy.shared('Menu.itemTypes');

/**
 * The Menu Manager Controller class
 *
 * @author        Jelle De Loecker   <jelle@develry.be>
 * @since         0.2.0
 * @version       0.5.0
 */
var Menu = Function.inherits('Alchemy.Controller.Chimera.Editor', function MenuManager(conduit, options) {
	MenuManager.super.call(this, conduit, options);
});

if (!Menu.setAction) {
	return;
}

/**
 * The edit action
 *
 * @param   {Conduit}   conduit
 */
Menu.setAction(function edit(conduit) {

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

	model.find('first', {conditions: {_id: alchemy.castObjectId(id)}}, function(err, item) {

		if (err) {
			return conduit.error(err);
		}

		if (!item) {
			return conduit.notFound();
		}

		that.set('actions', that.getActions());
		that.set('modelName', modelName);
		that.set('pageTitle', modelName.humanize());
		that.set('menuItem', item);
		that.set('menuTypes', types);
		that.internal('modelName', modelName);
		that.internal('recordId', id);

		that.render('chimera/menu/edit');
	});
});

/**
 * Action to create new menu piece
 *
 * @param   {Conduit}   conduit
 */
Menu.setAction(function create_piece(conduit) {

	var that   = this,
	    piece  = conduit.body.piece,
	    MP     = Model.get('MenuPiece'),
	    menuId = alchemy.castObjectId(conduit.param('id')),
	    data;

	if (!piece || !menuId) {
		return conduit.error(new Error('No new menu piece given'));
	}

	data = {
		menu_id: menuId,
		type: piece.type,
		settings: {
			order: piece.order,
			parent: piece.parent
		}
	};

	data = {MenuPiece: data};

	MP.save(data, function saved(err, result) {

		if (err || !result || !result.length) {
			return conduit.error(err);
		}

		conduit.end({MenuPiece: result[0]});
	});
});

/**
 * Action to order menu pieces
 *
 * @param   {Conduit}   conduit
 */
Menu.setAction(function order_pieces(conduit) {

	var ordered = conduit.body.ordered,
	    tasks   = {},
	    MP      = Model.get('MenuPiece');

	if (!ordered) {
		return conduit.error(new Error('No menu input given'));
	}

	Object.each(ordered, function eachPiece(piece, id) {

		var nr = piece.order,
		    parent = piece.parent;

		if (id && String(id).isObjectId()) {

			tasks[id] = function orderTask(next) {

				var data = {
					_id: alchemy.castObjectId(id),
					settings: {}
				};

				if (nr != null) {
					data.settings.order = nr;
				}

				if (piece.parent === false) {
					data.settings.parent = null;
				} else if (piece.parent) {
					data.settings.parent = piece.parent;
				}

				MP.save(data, function savedPiece(err, result) {
					next(err, result);
				});
			};
		}
	});

	Function.parallel(tasks, function orderedPieces(err, result) {

		if (err) {
			return conduit.error(err);
		}

		conduit.end('Success');
	});
});

/**
 * Action to configure a single menu piece
 *
 * @param   {Conduit}   conduit
 */
Menu.setAction(function configure(conduit) {

	var that = this,
	    modelName = conduit.routeParam('subject'),
	    model = Model.get(modelName),
	    chimera = model.behaviours.chimera,
	    id = conduit.routeParam('id');

	var actionFields = chimera.getActionFields('edit'),
	    groups = actionFields.groups.clone();

	model.find('first', {conditions: {_id: alchemy.castObjectId(id)}}, function(err, item) {

		if (err) {
			return conduit.error(err);
		}

		if (!items.length) {
			return conduit.notFound();
		}

		actionFields.processRecords(model, [items], function groupedRecords(err, groups) {

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

Menu.setAction(function save_piece(conduit) {

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