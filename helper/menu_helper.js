/**
 * The Menu helper
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.1
 * @version  0.5.0
 *
 * @param    {ViewRender}    view
 */
var Menu = Function.inherits('Alchemy.Helper', function Menu(view) {
	Menu.super.call(this, view);
});

/**
 * Print all the menus in a specific position
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.1
 * @version  0.3.0
 *
 * @param    {String}    name         The name of the position
 * @param    {Object}    options      Extra options
 */
Menu.setMethod(function printPosition(name, options) {

});

/**
 * Output a specifc menu
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.1
 * @version  0.6.1
 *
 * @param    {String}    name         The name of the menu
 * @param    {Object}    options      Extra options
 */
Menu.setMethod(function get(name, options) {

	var that = this,
	    placeholder;

	placeholder = this.view.async(function getMenu(next) {
		that.view.helpers.Alchemy.getResource({name: 'Menu#getMenu', params: {action: 'menu'}, body: {name: name}}, function gotResult(err, menu) {

			var placeholder;

			if (err) {
				return next(err);
			}

			placeholder = that.view.print_element('menu/wrapper', {menu: menu});

			if (placeholder.renderHawkejsContent) {
				placeholder.renderHawkejsContent().done(next);
			} else if (placeholder.getContent) {
				placeholder.getContent().done(next);
			} else {
				Blast.nextTick(next);
			}
		});
	});

	placeholder.from_menu = true;
});