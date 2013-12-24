var async = alchemy.use('async');

/**
 * The basic index page
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  0.0.1
 */
alchemy.create('ChimeraView', function MenuManagerChimeraView() {

	/**
	 * Build the edit view
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.edit = function edit(render, module, options) {

		var that       = this,
		    conditions = {},
		    urlParams  = render.req.route.params,
		    groupName,
		    fieldName,
		    fields,
		    groups,
		    model,
		    group,
		    field,
		    temp,
		    i;

		if (typeof options !== 'object') {
			options = {};
		}

		// Get the model
		model = this.getModel('Menu');

		// Set the view file
		render.view = 'chimera/menu_manager';
		
		render.viewVars.postUrl = module.getActionUrl('edit', urlParams);

		conditions['_id'] = render.req.params.id;

		if (render.get) {
			
			// Get the record we want to edit
			model.find('first', {conditions: conditions}, function (err, item) {

				var original   = model.name.modelName();
				
				render.viewVars.__current__ = item;
				render.viewVars.item = item;
				render.viewVars.originalItem = item;
				render.viewVars.routeVars.id = item[original]._id;
				render.viewVars.menuName = item[original].name;
				render.viewVars.menuId = item[original]._id;

				render();
			});
		} else if (render.post) {

		}
	};

});