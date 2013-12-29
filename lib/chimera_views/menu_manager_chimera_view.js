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
		render.viewVars.pieceUrl = module.getActionUrl('configure');
		render.viewVars.newPiece = module.getActionUrl('addPiece', urlParams)

		conditions['_id'] = render.req.params.id;

		if (render.get) {

			async.parallel([
				function getMenuSource(done) {
					model.getSource(render.req.params.id, function(err, source) {
						render.viewVars.menuSource = source;
						done();
					});
				},
				function getMenuRecord(done) {
					model.find('first', {conditions: conditions}, function(err, item) {

						var original   = model.name.modelName();
						
						render.viewVars.__current__ = item;
						render.viewVars.item = item;
						render.viewVars.originalItem = item;
						render.viewVars.routeVars.id = item[original]._id;
						render.viewVars.menuName = item[original].name;
						render.viewVars.menuId = item[original]._id;

						done();
					});
				}
			], function asyncDone() {
				render();
			});
			
		} else if (render.post) {

		}
	};

	this.configure = function configure(render, module, options) {
		var that = this,
		    pieceId = render.req.params.pieceid,
		    Menu    = this.getModel('Menu'),
		    MP      = this.getModel('MenuPiece'),
		    ME,
		    M;

		render.view = 'chimera/menu_piece_configure';
		ME = module.getView('ModelEditor');

		MP.find('first', {conditions: {_id: pieceId}}, function(err, result) {

			var piece = result.MenuPiece,
			    type  = Menu.getItemType(piece.type),
			    groups,
			    fields,
			    data;

			if (render.post) {
				data = render.req.body;

				if (data && data.data) {
					data = data.data.ModelEditorField;
				}
				
				piece.settings = alchemy.merge(piece.settings||{}, data);
			}

			m = module.getModule('ModelEditor');
			groups = ME.getModelGroups(type);
			fields = ME.getGroupFields(groups);

			render.viewVars.piece = piece;
			render.viewVars.blueprint = type.blueprint;
			render.viewVars.__groups = groups;

			ME.prepareFields(m, that, piece.settings, fields, function afterPrepareFields() {

				if (render.post) {
					MP.save(piece, function(err, results) {
						render();
					})
				} else {
					render();
				}
			});
			
		});
	};

});