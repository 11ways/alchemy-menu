/**
 * The Menu Piece Model class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  0.0.1
 */
Model.extend(function MenuPieceModel (){

	this.types = alchemy.shared('Menu.itemTypes');

	this.preInit = function preInit() {
		this.parent();

		this.hasOneParent = {
			Menu: {
				modelName: 'Menu',
				foreignKey: 'menu_id'
			}
		};
		
		this.blueprint = {
			menu_id  : 'ObjectId',
			type     : 'String',
			settings : 'Object'
		};

		this.inItemAclPath = 'settings._acl';
	};

});
