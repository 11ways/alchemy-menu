module.exports = function alchemyMenuHelpers(Hawkejs, Blast) {

	var Menu = Hawkejs.Helper.extend(function MenuHelper(view) {
		Hawkejs.Helper.call(this, view);
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
	 * @version  0.4.0
	 *
	 * @param    {String}    name         The name of the menu
	 * @param    {Object}    options      Extra options
	 */
	Menu.setMethod(function get(name, options) {

		var that = this;

		this.view.async(function getMenu(next) {
			that.view.helpers.Alchemy.getResource({name: 'APIResource', params: {action: 'menu'}, body: {name: name}}, function gotResult(err, menu) {

				var placeholder;

				if (err) {
					return next(err);
				}

				placeholder = that.view.print_element('menu/wrapper', {menu: menu});

				placeholder.getContent(next);
			});
		});
	});
};