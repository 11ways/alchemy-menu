/**
 * Connection links
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  1.0.0
 */
Function.inherits('MenuItemType', function ConnectionMenuItemType() {
	ConnectionMenuItemType.super.call(this);

	this.blueprint.setEnumValues('connections', alchemy.shared('Routing.routes'));
	this.blueprint.addField('connection', 'Enum');
});

return;
/**
 * The Connection Menu Item Type
 */
alchemy.create('MenuItemType', function ConnectionMIT() {

	this.connections = alchemy.shared('Connection.all');

	this.blueprint = {
		connection: {
			type: 'Enum'
		}
	};

	/**
	 * Configure this menu piece
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.configure = function configure(data, settings, callback) {

		if (settings.connection) {
			settings.url = Connection.url(settings.connection, settings.options);
		}

		callback(null, settings);
	};

});