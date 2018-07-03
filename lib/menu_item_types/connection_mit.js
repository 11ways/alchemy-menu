/**
 * Connection links
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.1
 * @version  0.2.0
 */
Function.inherits('MenuItemType', function ConnectionMenuItemType() {
	ConnectionMenuItemType.super.call(this);

	this.blueprint.setEnumValues('connections', alchemy.shared('Routing.routes'));
	this.blueprint.addField('connection', 'Enum');
});