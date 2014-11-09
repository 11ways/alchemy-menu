/**
 * Links are basic user-inputted hrefs
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  1.0.0
 */
Function.inherits('MenuItemType', function LinkMenuItemType() {
	LinkMenuItemType.super.call(this);

	this.blueprint.addField('url', 'Url');
});