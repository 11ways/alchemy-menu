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
alchemy.classes.BaseClass.extend(function MenuItemType (){

	/**
	 * The default settings of a built piece
	 *
	 * @type {Object}
	 */
	this.baseDefaultPieceSettings = {

		// The frame target
		target: '_self',

		// The parent link
		parent: false
	};

	/**
	 * The default translatable settings of a built piece
	 *
	 * @type {Object}
	 */
	this.baseDefaultPieceTranslatableSettings = {

		// The actual url to use
		url: null,

		// The title to display
		title: null
	};

	/**
	 * The default settings children can modify
	 *
	 * @type {Object}
	 */
	this.defaultPieceSettings = null;

	/**
	 * The default translatable settings children can modify
	 *
	 * @type {Object}
	 */
	this.defaultPieceTranslatableSettings = null;

	/**
	 * Instantiate a newly created MIT after this class has been extended
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {Function}   parent   The parent class
	 * @param    {Function}   child    The (extended) child class
	 */
	this.__extended__ = function __extended__(parentMIT, childMIT) {

		// Remove MIT or MenuItemType from the name
		var typeName = childMIT.name.replace(/MenuItemType$|MIT$/, '');

		// Store the names in the prototype
		childMIT.prototype.title = typeName;

		typeName = typeName.underscore();

		childMIT.prototype.typeName = typeName;

		// Do not let the child inherit the extendonly setting
		if (!childMIT.prototype.hasOwnProperty('extendonly')) {
			childMIT.prototype.extendonly = false;
		}

		// Create a new instance if this is a useable type
		if (!childMIT.prototype.extendonly) {
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
	 * @version  0.0.1
	 */
	this.cloneDefaultSettings = function cloneDefaultSettings() {

		var settings = {};

		alchemy.inject(
			settings,
			this.baseDefaultPieceSettings,
			this.defaultPieceSettings);

		alchemy.inject(
			settings,
			this.baseDefaultPieceTranslatableSettings,
			this.defaultPieceTranslatableSettings);

		return settings;
	};

	/**
	 * Build this menu piece
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {Object}   data       The MenuPiece record data from the db
	 * @param    {Function} callback   The function to call back
	 */
	this.build = function build(data, callback) {

		// Create the target settings object
		var settings = this.cloneDefaultSettings();

		// Inject the settings from the database
		alchemy.inject(settings, data.settings);
		alchemy.inject(settings, data.translatable_settings);

		this.configure(data, settings, callback);
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