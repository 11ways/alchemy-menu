/**
 * The Connection Menu Item Type
 */
alchemy.create('MenuItemType', function ConnectionMIT() {

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