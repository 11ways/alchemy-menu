module.exports = function alchemyMenuHelpers(Hawkejs, Blast) {

	var Menu = Hawkejs.Helper.extend(function MenuHelper(view) {
		Hawkejs.Helper.call(this, view);
	});

	/**
	 * Output a menu
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  1.0.0
	 *
	 * @param    {String}    name         The name of the menu
	 * @param    {Object}    options      Extra options
	 */
	Menu.setMethod(function get(name, options) {

		var that = this;

		this.view.async(function getMenu(next) {
			that.view.helpers.Alchemy.getResource('menu', {name: name}, function gotResult(err, pieces) {

				var tree = treeify(pieces),
				    placeholder;

				placeholder = that.view.print_element('menu/wrapper', {items: Object.values(tree)});

				placeholder.getContent(next);
			});
		});
	});
};