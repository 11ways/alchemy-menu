/**
 * The Menu Model class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.0.1
 * @version  1.0.0
 */
var Menu = Function.inherits('Model', function MenuModel(options) {

	var chimera,
	    list,
	    edit,
		view;

	MenuModel.super.call(this, options);

	// Create the chimera behaviour
	chimera = this.addBehaviour('chimera');

	// Get the list group
	list = chimera.getActionFields('list');

	list.addField('name');

	// Get the edit group
	edit = chimera.getActionFields('edit');

	edit.addField('name');

	// Get the view group
	view = chimera.getActionFields('view');

	view.addField('name');
});

Menu.addField('name', 'String');
Menu.hasMany('MenuPiece');