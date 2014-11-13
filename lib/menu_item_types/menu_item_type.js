var MenuItemTypes = alchemy.shared('Menu.itemTypes'),
    MenuItemType,
    Blast      = __Protoblast;

Blast.on('extended', function(parent, child) {

	var typeName,
	    name;

	if (parent.name.endsWith('MenuItemType')) {
		name = child.name.beforeLast('MenuItemType') || 'MenuItemType';
		typeName = name.underscore();

		child.setProperty('title', name.humanize());
		child.setProperty('typeName', typeName);

		MenuItemTypes[typeName] = child;
	}
});

/**
 * The menu item type class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  1.0.0
 */
MenuItemType = Function.inherits(function MenuItemType() {

	var schema = new alchemy.classes.Schema(this);

	schema.addEnumValues('targets', {
		'_self': __('chimera', 'Current Frame'),
		'_blank': __('chimera', 'New Window'),
		'_parent': __('chimera', 'Parent Frame (or current)'),
		'_top': __('chimera', 'Current Tab')
	});

	schema.addField('target', 'Enum', {default: '_self'});
	schema.addField('parent', 'ObjectId', {default: false});
	schema.addField('order', 'Number', {default: 0});
	schema.addField('title', 'String');
	schema.addField('name', 'String');

	// @todo: _acl field

	this.blueprint = schema;
});

MenuItemType.setProperty('allowChildren', true);

/**
 * Build this menu piece
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  1.0.0
 *
 * @param    {Object}   data       The MenuPiece record data from the db
 * @param    {Function} callback   The function to call back
 */
MenuItemType.setMethod(function build(data, callback) {
	var that = this;
	this.configure(data, Object.assign({}, data.settings), callback);
});

/**
 * Do the configuration
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  1.0.0
 *
 * @param    {Object}   data       The MenuPiece record data from the db
 * @pram     {Object}   settings   The copied settings
 * @param    {Function} callback   The function to call back
 */
MenuItemType.setMethod(function configure(data, settings, callback) {
	callback(null, settings);
});


return;


alchemy.classes.BaseClass.extend(function MenuItemType() {

	/**
	 * Clone the default settings and return them as a new object
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.2.0
	 */
	this.cloneDefaultSettings = function cloneDefaultSettings(recordData) {

		var settings = {};

		Object.assign(settings, this.defaultSettings);

		return settings;
	};


	this.build = function build(data, callback) {

		// Create the target settings object
		var settings = this.cloneDefaultSettings(data),
		    fieldname,
		    prefix,
		    config,
		    key;

		// Inject the settings from the database
		Object.assign(settings, data.settings);

		// Get the current prefix
		// @todo: what about prefix fallbacks?
		prefix = this.render.prefix;

		// Translate what needs translating
		for (fieldname in this.blueprint) {
			config = this.blueprint[fieldname];
			entry  = settings[fieldname];

			if (config.translatable) {
				if (typeof settings[fieldname] === 'object' && settings[fieldname] !== null) {
					if (typeof settings[fieldname][prefix] !== 'undefined') {
						settings[fieldname] = settings[fieldname][prefix];
					} else {
						settings[fieldname] = config.default || null;
					}
				}
			}
		}

		this.configure(data, settings, callback);
	};

	/**
	 * Get the title to display in the menu manager
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {Object}   data       The MenuPiece record data from the db
	 */
	this.getPieceTitle = function getPieceTitle(data) {

		var result = String(this.typeName).titleize();

		if (data.settings && data.settings.name) {
			result += ': ' + data.settings.name;
		}
		
		return result;
	};


});