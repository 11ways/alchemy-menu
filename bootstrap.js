
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

// Inject the user-overridden options
alchemy.plugins.menu = alchemy.inject(options, alchemy.plugins.menu);

// Send the menu options to the client
alchemy.on('render.callback', function(render, callback) {

	// Only send this data on the initial pageload
	if (!render.ajax) {
		render.store('menuOptions', alchemy.plugins.menu);
	}
	
	callback();
});