var async = alchemy.use('async');

/**
 * The Menu Model class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.0.1
 * @version  0.0.1
 */
Model.extend(function MenuModel (){

	this.itemTypes = alchemy.shared('Menu.itemTypes');

	this.preInit = function preInit() {
		this.parent();

		this.displayField = 'name';

		this.hasMany = {
			MenuPiece: {
				modelName: 'MenuPiece',
				foreignKey: 'menu_id'
			}
		};
		
		this.blueprint = {
			name    : 'String'
		};
	};

	/**
	 * Get the menu item type instance.
	 * Returns the link type if nothing valid is found.
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.getItemType = function getItemType(name) {

		if (!name) {
			name = 'link'
		} else {
			name = name.underscore();
		}

		if (this.itemTypes[name]) {
			return this.itemTypes[name];
		} else {
			// Return the link item type by default
			return this.itemTypes['link'];
		}
	};

	/**
	 * Get all the available menu types
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.getTypes = function getTypes() {
		
	};

	/**
	 * Get the menu source
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {String}   menuId    The id of the wanted menu
	 * @param    {Function} callback
	 */
	this.getSource = function getSource(menuId, callback) {

		var that = this;

		this.find('first', {conditions: {'Menu._id': menuId}}, function (err, recordData) {

			var resultArray = [],
			    results     = {},
			    allowChildren,
			    itemType,
			    filtered,
			    settings,
			    piece,
			    i;

			recordData = recordData[0];

			// Conform all the pieces
			for (i = 0; i < recordData.MenuPiece.length; i++) {

				piece = recordData.MenuPiece[i];
				settings = piece.settings || {};
				itemType = that.getItemType(piece.type);

				if (itemType) {
					allowChildren = itemType.allowChildren;
				} else {
					allowChildren = true;
				}

				results[piece._id] = {
					id: piece._id,
					settings: settings,
					translatable_settings: piece.translatable_settings || {},
					type: piece.type,
					title: itemType.getPieceTitle(piece),
					order: settings.order || 5,
					suborder: i,
					parent: settings.parent || null,
					allowChildren: allowChildren,
					children: []
				};
			}

			callback(err, results);
		});
	};

	/**
	 * Get a menu by its name
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {String}   menuName   The name of the wanted menu
	 * @param    {Function} callback
	 */
	this.get = function get(menuName, callback) {

		var that = this;

		this.find('first', {
			conditions: {
				'Menu.name': menuName
			}
		}, function(err, result) {

			var menu, piece, i, tasks = {};

			if (result.length) {
				result = result[0];
				menu = result.Menu;

				for (i = 0; i < result.MenuPiece.length; i++) {

					// Get the current menu piece data
					piece = result.MenuPiece[i];

					if (that.itemTypes[piece.type]) {

						(function(piece) {
							// Prepare the task to execute the builds in parallel
							tasks[piece._id] = function buildMenuPiece(callback) {

								var it = that.itemTypes[piece.type];
								it = it.augment(that.__augment__);
								it.model = that;

								it.build(piece, function(err, result) {
									callback(err, result);
								});
							};
						}(piece));
					}
				}
			}

			// Process the data we get back from all the menu item types
			async.parallel(tasks, function(err, result) {

				var id, cid, entry, centry, parent, menu = [], tree;

				// First merge all the pieces containing multiple entries
				for (id in result) {

					entry = result[id];

					// If the entry is invalid, continue
					if (!entry) {
						delete result[id];
						continue;
					}

					// If this entry actually contains multiple entries
					// add them to the object
					if (entry.entries) {

						// Remove the original entry
						delete result[id];

						for (cid in entry.entries) {
							centry = entry.entries[cid];
							result[centry.id] = centry;
						}
					}
				}

				// Remove entries without a title and link
				for (id in result) {
					entry = result[id];

					if (!entry.title && !entry.href) {
						delete result[id];
					}
				}

				// Turn the result into a tree
				tree = alchemy.hawkejs.treeify(result, {type: 'array', childrenType: 'array'});

				// Order the tree and its children
				menu = alchemy.hawkejs.order(tree, {children: 'children'});

				// Go over all the items again (in result) and remove certain properties
				for (id in result) {
					entry = result[id];

					// Remove the menu_id
					delete entry.menu_id;
					delete entry._id;
					delete entry.updated;
					delete entry.created;

					// We can also remove the parent property now
					delete entry.parent;
				}

				if (callback) callback(err, menu);
			});
		});

	};
});

/**
 * Make basic field information about a model available
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.0.1
 * @version  0.0.1
 */
Resource.register('menu', function(data, callback) {

	this.getModel('Menu').get(data.name, function(err, result) {
		callback(result);
	});
});