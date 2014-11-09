/**
 * The Menu Piece Model class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  1.0.0
 */
var Piece = Function.inherits('Model', function MenuPieceModel(options) {

	var chimera,
	    list,
	    edit,
		view;

	MenuPieceModel.super.call(this, options);

	this.types = alchemy.shared('Menu.itemTypes');

	// Create the chimera behaviour
	chimera = this.addBehaviour('chimera');

	// Get the list group
	list = chimera.getActionFields('list');

	list.addField('_id');

	// Get the edit group
	edit = chimera.getActionFields('edit');

	edit.addField('menu_id');
	edit.addField('type');
	edit.addField('settings');

	// Get the view group
	view = chimera.getActionFields('view');

	view.addField('type');

});

Piece.addField('type', 'Enum');
Piece.addField('settings', 'Schema', {schema: 'type'});

Piece.hasOneParent('Menu');
Piece.setEnumValues('types', alchemy.shared('Menu.itemTypes'));