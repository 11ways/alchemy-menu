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

			pr(result, true)

			var menu, piece, i, tasks = {};

			if (result) {
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

				var id, cid, entry, centry, parent, menu = [];

				// First merge all the pieces containing multiple entries
				for (id in result) {
					entry = result[id];

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

				// Turn the entries into a tree
				for (id in result) {
					entry = result[id];

					if (entry.parent) {

						// Get the parent item
						parent = result[entry.parent];

						// If the parent item actually exists
						if (parent) {

							// Create a children array if it doesn't exist
							if (!parent.children) {
								parent.children = [];
							}

							parent.children.push(entry);
						}
					}

					if (!entry.title && !entry.href) {
						delete result[id];
					}
				}

				// Now remove all the entries with a parent from the root
				for (id in result) {
					entry = result[id];

					// Remove the menu_id
					delete entry.menu_id;
					delete entry._id;
					delete entry.updated;
					delete entry.created;

					// If this entry does not have a parent, add it to the root of the menu
					if (!entry.parent) {
						menu.push(entry);
					}

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