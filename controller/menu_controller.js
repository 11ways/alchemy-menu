/**
 * The Menu Controller class
 *
 * @extends  Alchemy.Controller.App
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.5.0
 *
 * @param    {Conduit}   conduit
 * @param    {Object}    options
 */
var Menu = Function.inherits('Alchemy.Controller.App', function Menu(conduit, options) {
	Menu.super.call(this, conduit, options);
});

/**
 * Return menu information
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.1
 * @version  0.4.0
 */
Menu.setAction(function getMenu(conduit) {

	var data = conduit.body;

	this.getModel('Menu').get(data.name, function done(err, result) {

		if (err) {
			return conduit.error(err);
		}

		conduit.end(result);
	});
});