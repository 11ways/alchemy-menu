/**
 * The Menu Piece Model class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.1
 * @version  0.2.0
 */
var Piece = Function.inherits('Model', function MenuPieceModel(options) {
	MenuPieceModel.super.call(this, options);
	this.types = alchemy.shared('Menu.itemTypes');
});

/**
 * Constitute the class wide schema
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Piece.constitute(function addFields() {
	this.addField('type', 'Enum');
	this.addField('settings', 'Schema', {schema: 'type'});

	this.hasOneParent('Menu');
	this.setEnumValues('types', alchemy.shared('Menu.itemTypes'));
});

/**
 * Configure chimera for this model
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Piece.constitute(function chimeraConfig() {

	var list,
	    edit,
	    view;

	if (!this.chimera) {
		return;
	}

	// Get the list group
	list = this.chimera.getActionFields('list');

	list.addField('_id');

	// Get the edit group
	edit = this.chimera.getActionFields('edit');

	edit.addField('menu_id');
	edit.addField('type');
	edit.addField('settings');

	// Get the view group
	view = this.chimera.getActionFields('view');

	view.addField('type');
});