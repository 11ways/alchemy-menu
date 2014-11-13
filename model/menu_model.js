var MenuItemTypes = alchemy.shared('Menu.itemTypes');

/**
 * The Menu Model class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.0.1
 * @version  1.0.0
 */
var Menu = Function.inherits('Model', function MenuModel(options) {

	var chimera,
	    list,
	    edit,
		view;

	MenuModel.super.call(this, options);

	// Create the chimera behaviour
	chimera = this.addBehaviour('chimera');

	// Get the list group
	list = chimera.getActionFields('list');

	list.addField('name');

	// Get the edit group
	edit = chimera.getActionFields('edit');

	edit.addField('name');

	// Get the view group
	view = chimera.getActionFields('view');

	view.addField('name');
});

Menu.constitute(function constitute() {
	this.addField('name', 'String');
	this.hasMany('MenuPiece');
});

/**
 * Get a menu by its name
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  1.0.0
 *
 * @param    {String}   menuName   The name of the wanted menu
 * @param    {Function} callback
 */
Menu.setMethod(function get(menuName, callback) {

	var that = this,
	    options;

	options = {
		conditions: {
			'Menu.name': menuName
		}
	};

	this.find('first', options,function gotMenu(err, result) {

		var piece,
		    tasks,
		    menu,
		    i;

		if (err != null) {
			return callback(err);
		}

		if (result.length == 0) {
			return callback(new Error('Could not find menu ' + menuName));
		}

		// Get the first result
		result = result[0];
		menu = result.Menu;
		tasks = {};

		result.MenuPiece.forEach(function eachPiece(piece, index) {

			if (!piece) {
				return;
			}

			if (MenuItemTypes[piece.type]) {

				// Prepare the task to execute the builds in parallel
				tasks[piece._id] = function buildMenuPiece(next) {
					var type = new MenuItemTypes[piece.type]();
					type.build(piece, next);
				};
			}
		});

		Function.parallel(tasks, function doneTasks(err, result) {

			if (err != null) {
				return callback(err);
			}

			callback(null, result);
		});
	});
});

/**
 * Return menu information
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.0.1
 * @version  1.0.0
 */
Resource.register('menu', function getMenuData(data, callback) {
	this.getModel('Menu').get(data.name, callback);
});