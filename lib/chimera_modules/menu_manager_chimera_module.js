return
/**
 * The Menu Manager Module
 *
 * @author   Jelle De Loecker   <jelle@codedor.be>
 * @since    0.0.1
 * @version  0.0.1
 */
alchemy.create('ChimeraModule', function MenuManagerChimeraModule() {

	this.routeName = 'menu';

	this.actions = {
		index: {
			route: '/index',
			title: __('chimera', 'Index'),
			class: 'btn-primary',
			icon: 'list',
		},
		view: {
			route: '/view/:id',
			title: __('chimera', 'View'),
			icon: 'eye'
		},
		edit: {
			route: '/edit/:id',
			title: __('chimera', 'Edit'),
			icon: 'pencil'
		},
		add: {
			route: '/add',
			title: __('chimera', 'Add'),
			icon: 'plus'
		},
		configure: {
			route: '/configure/:pieceid',
			title: __('chimera', 'Configure'),
			icon: 'wrench'
		},
		configure_order: {
			route: '/configure_order'
		},
		addPiece: {
			route: '/addPiece/:id'
		}
	};

	this.actionLists = {
		paginate: ['index', 'add'],
		record: ['view', 'edit']
	};

	/**
	 * The index view
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.index = function index(render) {
		var BaseIndex = this.getView('BaseIndex');
		BaseIndex.build(render, {
			defaultFields: ['created', 'updated', 'name'],
			excludeFields: ['_id', '__v'],
			defaultFieldType: 'json',
			model: 'Menu'
		});
	};

	/**
	 * The edit json view
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.edit = function edit(render) {
		var MenuManager = this.getView('MenuManager');
		MenuManager.edit(render, this, {});
	};

	/**
	 * Add a menu piece
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.addPiece = function addPiece(render) {
		
		var menuId = render.req.params.id,
		    menu   = this.getModel('Menu'),
		    piece  = {};


		pr(render.req.body.pieceType);

		piece['menu_id'] = menuId;

		render();
	};

	/**
	 * The action to configure a menu piece
	 */
	this.configure = function configure(render) {
		var MenuManager = this.getView('MenuManager');
		MenuManager.configure(render, this, {});
	};

	/**
	 * The action to configure the order of menu pieces
	 */
	this.configure_order = function configure_order(render) {
		var MenuManager = this.getView('MenuManager');
		MenuManager.configure_order(render, this, {});
	};

	/**
	 * The add json view
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.add = function add(render) {
		var ModelViews = this.getView('ModelEditor');
		ModelViews.add(render, this, {});
	};

	/**
	 * The view json view
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	this.view = function view(render) {
		var JsonView = this.getView('JsonEdit');
		JsonView.build(render, this, {onlyView: true});
	};

	/**
	 * Configure the menu pieces
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param   {Array}          entries    The current entries array
	 * @param   {String}         parent     Parent to use for all new entries
	 * @param   {MenuItemType}   mit        The ChimeraModuleMIT
	 * @param   {Object}         data       Menu piece record data
	 * @param   {Object}         settings   The settings to use
	 *
	 * @return  {Array}          The resulting entries
	 */
	this.configureMenuEntries = function configureMenuEntries(entries, parent, mit, data, settings) {

		var entry = alchemy.cloneSafe(settings);

		if (!entry.id) {
			entry.id = 'ChimeraMenuManager';
		}

		if (!entry.title) {
			entry.title = __('chimera', 'Menu Manager');
		}

		entry.url = this.getActionUrl('index');
		entry.parent = parent;
		entry.greedy = this.getBaseUrl();

		if (!entry.icon) {
			entry.icon = 'list';
		}

		entries[entry.id] = entry;
	};

});