var MenuItemTypes = alchemy.shared('Menu.itemTypes');

/**
 * The menu item type class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.0.1
 * @version  0.0.1
 */
alchemy.classes.BaseClass.extend(function MenuItemType() {

	this.targets = {
		'_self': __('chimera', 'Current Frame'),
		'_blank': __('chimera', 'New Window'),
		'_parent': __('chimera', 'Parent Frame (or current)'),
		'_top': __('chimera', 'Current Tab')
	};

	/**
	 * The default blueprint
	 *
	 * @type {Object}
	 */
	this.baseBlueprint = {
		// The frame target
		target: {
			type: 'Enum',
			default: '_self'
		},

		// The parent link
		parent: {
			type: 'string',
			default: false
		},

		// The order of the link
		order: {
			type: 'Number'
		},

		// The actual url to use
		url: {
			type: 'string',
			default: null,
			translatable: true
		},

		// The title to display
		title: {
			type: 'string',
			default: null,
			translatable: true
		},

		// The name for internal cms use
		name: {
			type: 'string',
			default: null
		},

		// Acl settings
		_acl: {
			type: 'Object',
			fieldType: 'AclRecord'
		}
	};

	/**
	 * The blueprint children can modify
	 *
	 * @type {Object}
	 */
	this.blueprint = null;

	/**
	 * Instantiate a newly created MIT after this class has been extended
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.2.0
	 *
	 * @param    {Function}   parent   The parent class
	 * @param    {Function}   child    The (extended) child class
	 */
	this.__extended__ = function __extended__(parentMIT, childMIT) {

		var blueprint = {},
		    proto     = childMIT.prototype,
		    typeName,
		    key;

		// Remove MIT or MenuItemType from the name
		typeName = childMIT.name.replace(/MenuItemType$|MIT$/, '');

		// Store the names in the prototype
		proto.title = typeName;
		typeName = typeName.underscore();
		proto.typeName = typeName;
		proto.defaultSettings = {};

		// Merge the blueprints together
		Object.assign(blueprint, proto.baseBlueprint, proto.blueprint);

		// Store them back into the blueprints property
		proto.blueprint = blueprint;

		// Create the default settings object
		for (key in blueprint) {
			proto.defaultSettings[key] = blueprint[key].default || null;
		}

		// Do not let the child inherit the extendonly setting
		if (!proto.hasOwnProperty('extendonly')) {
			proto.extendonly = false;
		}

		// Create a new instance if this is a useable type
		if (!proto.extendonly) {
			MenuItemTypes[typeName] = new childMIT();
		}
	};

	/**
	 * Prepare several instance properties
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.preInit = function preInit() {
		this.parent();
		
		// MenuItemTypes can have children by default
		this.allowChildren = true;
	};

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

	/**
	 * Build this menu piece
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.2.0
	 *
	 * @param    {Object}   data       The MenuPiece record data from the db
	 * @param    {Function} callback   The function to call back
	 */
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

	/**
	 * Do the configuration
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {Object}   data       The MenuPiece record data from the db
	 * @pram     {Object}   settings   The copied settings
	 * @param    {Function} callback   The function to call back
	 */
	this.configure = function configure(data, settings, callback) {
		callback(null, settings);
	};
});