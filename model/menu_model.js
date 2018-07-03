var MenuItemTypes = alchemy.getClassGroup('menu_item'),
    default_menus = {};

/**
 * The Menu Model class
 *
 * @constructor
 * @extends      {Alchemy.Model}
 *
 * @author       Jelle De Loecker   <jelle@develry.be>
 * @since        0.0.1
 * @version      0.3.0
 *
 * @type         {Object}   options
 */
var Menu = Function.inherits('Alchemy.Model', function Menu(options) {
	Menu.super.call(this, options);
});

/**
 * Constitute the class wide schema
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.2.0
 * @version  0.3.0
 */
Menu.constitute(function constitute() {

	var items;

	// Each menu has an internal name
	this.addField('name', 'String');

	// Each menu also has an assigned position
	this.addField('position_name', 'String');

	// Each menu can also have a title,
	// though it need not be used
	this.addField('title', 'String', {translatable: true});

	// A place for themes to store custom settings
	this.addField('theme_settings', 'Object');

	// Create the items schema
	items = new Classes.Alchemy.Schema();

	// ObjectId for this menu item
	items.addField('id', 'ObjectId', {default: alchemy.ObjectId});

	// Type of the item
	items.addField('type', 'Enum', {values: alchemy.getClassGroup('menu_item')});

	// The optional parent item (if this type supports it, that is)
	items.addField('parent', 'ObjectId');

	// The weight of this item
	items.addField('weight', 'Number');

	// Another schema level, depending on the 'type' chosen
	items.addField('settings', 'Schema', {schema: 'type'});

	// Now add the items sub schema as a field
	this.addField('items', 'Schema', {schema: items, array: true});

	// Menus can be personalized
	this.belongsTo('User');
});

/**
 * Configure chimera for this model
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.2.0
 * @version  0.3.0
 */
Menu.constitute(function chimeraConfig() {

	var list,
	    edit,
	    view;

	if (!this.chimera) {
		return;
	}

	// Get the list group
	list = this.chimera.getActionFields('list');

	list.addField('name');
	list.addField('title');

	// Get the edit group
	edit = this.chimera.getActionFields('edit');

	edit.addField('name');
	edit.addField('title');
	edit.addField('items');

	// Get the view group
	view = this.chimera.getActionFields('view');

	view.addField('name');
});

/**
 * Get or create a default menu document:
 * a menu created in code, that can be overridden
 * by the user
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @param    {String}   name      The name of the wanted menu
 *
 * @return   {Alchemy.MenuModelDocument}
 */
Menu.setStatic(function getDefault(name) {

	var menu_document;

	// See if the menu document already exists
	if (default_menus[name]) {
		return default_menus[name];
	}

	// Create the document
	menu_document = new Classes.Alchemy.Model.Menu.Document({
		name  : name,
		items : []
	});

	// Store the document for later use
	default_menus[name] = menu_document;

	return menu_document;
});

/**
 * Get all menus assigned to a specific position
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @param    {String}   position_name   The name of the position
 * @param    {Object}   options
 * @param    {Function} callback
 */
Menu.setMethod(function getPosition(position_name, options, callback) {

	var that = this,
	    def_result = [],
	    result = [];

	if (typeof options == 'function') {
		callback = options;
		options = null;
	}

	if (!options) {
		options = {};
	}

	Function.parallel(function queryDatabase(next) {

		var query_options = {
			conditions: {
				position_name : position_name
			}
		};

		if (that.conduit) {
			// @TODO: get overloaded menus
		} else {
			query_options.conditions.user_id = null;
		}

		that.find('all', query_options, function gotMenus(err, result) {

			var i;

			if (err) {
				return next(err);
			}

			result.forEach(function eachMenu(menu) {
				result.push(menu);
			});

			next();
		});
	}, function getDefault(next) {

		var menu,
		    key;

		for (key in default_menus) {
			menu = default_menus[key];

			if (menu.position_name == position_name) {
				def_result.push(menu);
			}
		}

		next();
	}, function done(err) {

		var allow,
		    menu,
		    i,
		    j;

		if (err) {
			return callback(err);
		}

		for (i = 0; i < def_result.length; i++) {
			menu = def_result[i];
			allow = true;

			// See if this default menu has already been overridden
			for (j = 0; j < result.length; j++) {
				if (result[j].name == menu.name) {
					allow = false;
					break;
				}
			}

			// It has not, so add it now
			if (allow) {
				result.push(menu);
			}
		}

		callback(null, result);
	});
});

/**
 * Get a menu by its name
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.1
 * @version  0.4.0
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

		if (err) {
			return callback(err);
		}

		if (!result) {

			result = Menu.getDefault(menuName);

			// If there are no items  in the default menu,
			// act as if it doesn't exist
			if (!result.items.length) {
				return callback(new Error('Could not find menu ' + menuName));
			}
		}

		// Get the first result
		menu = result.Menu;
		tasks = {};

		menu.items.sortByPath(-1, 'weight');

		menu.items.forEach(function eachPiece(piece, index) {

			if (!piece) {
				return;
			}

			if (MenuItemTypes[piece.type]) {

				// Prepare the task to execute the builds in parallel
				tasks[piece.id] = function buildMenuPiece(next) {

					var type = new MenuItemTypes[piece.type](piece, menu);

					type.configure(next);
				};
			}
		});

		Function.parallel(tasks, function doneTasks(err, result) {

			if (err != null) {
				return callback(err);
			}

			callback(null, menu);
		});
	});
});

/**
 * Add a menu item
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @param    {String}   item_type   Type of item to add
 * @param    {Object}   options     Configuration of that item
 */
Menu.setDocumentMethod(function addItem(item_type, options) {

	var item;

	if (!options) {
		options = {};
	}

	item = {
		id       : alchemy.ObjectId(),
		type     : item_type,
		settings : options.settings || {},
		parent   : options.parent_id
	};

	// Make sure the items array exists
	if (!this.items) {
		this.items = [];
	}

	if (options.weight) {
		item.weight = options.weight;
	} else {
		item.weight = 0;
	}

	this.items.push(item);

	return item;
});