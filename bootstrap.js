
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

var linkmap = alchemy.shared('Connection.map');

// Inject the user-overridden options
alchemy.plugins.menu = Object.assign(options, alchemy.plugins.menu);

// Send the menu options to the client
alchemy.hawkejs.on({type: 'viewrender', status: 'begin', client: false}, function onBegin(viewRender) {
	viewRender.expose('linkMap', linkmap);
	viewRender.expose('menuOptions', alchemy.plugins.menu);
});