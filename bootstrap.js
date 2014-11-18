
// Define the default menu options
var options = {

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

var linkmap = alchemy.shared('Connection.map'),
    menus;

// Inject the user-overridden options
alchemy.plugins.menu = Object.assign(options, alchemy.plugins.menu);

alchemy.ready(function preloadMenus() {

	var Menu = Model.get('Menu');

	Menu.find('all', function allMenus(err, results) {

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

			for (j = 0; j < temp.MenuPiece.length; j++) {
				c = temp.MenuPiece[j];
				children.push(Object.assign({
					id: c._id,
					type: c.type
				}, c.settings));
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
