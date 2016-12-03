var linkmap = alchemy.shared('Connection.map'),
    options,
    menus;

// Define the default menu options
options = {

	// The wrapper
	wrap: {
		element: 'nav',
		class: 'navbar',
		attributes: {}
	},

	// The main
	main: {
		element: 'ul',
		class: 'nav',
		attributes: {}
	},

	// The anchor wrapper
	anchorWrap: {
		element: 'li'
	},

	// The anchor
	anchor: {
		element: 'a'
	}
};

// Inject the user-overridden options
alchemy.plugins.menu = Object.assign(options, alchemy.plugins.menu);

/**
 * Get the default menu object
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 */
alchemy.plugins.menu.getDefault = function getDefault(name, callback) {
	// Wait for alchemy, and all models, to be ready
	alchemy.ready(function onReady() {

		// Get the actual menu
		var menu = Classes.Alchemy.MenuModel.getDefault(name);

		callback(null, menu);
	});
};

alchemy.ready(function preloadMenus() {

	var Menu = Model.get('Menu');

	Menu.find('all', {document: false}, function allMenus(err, results) {

		var children,
		    entry,
		    temp,
		    c,
		    i,
		    j;

		menus = {};

		for (i = 0; i < results.length; i++) {
			temp = results[i];
			children = [];

			if (temp.MenuPiece) {
				for (j = 0; j < temp.MenuPiece.length; j++) {
					c = temp.MenuPiece[j];
					children.push(Object.assign({
						id: c._id,
						type: c.type
					}, c.settings));
				}
			}

			entry = {
				name: temp.Menu.name,
				id: temp.Menu._id,
				children: children
			};

			menus[temp.Menu.name] = entry;
		}
	});
});

// Send the menu options to the client
alchemy.hawkejs.on({type: 'viewrender', status: 'begin', client: false}, function onBegin(viewRender) {

	viewRender.expose('allMenus', menus);
	viewRender.expose('linkMap', linkmap);
	viewRender.expose('menuOptions', alchemy.plugins.menu);
});
