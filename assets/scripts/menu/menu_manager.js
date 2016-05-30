hawkejs.require(['chimera/chimera', 'menu/treeify'], function applyManager() {

	// Make the "Save" button work inside the modal menu configure
	hawkejs.scene.on({type: 'set', name: 'menuPieceConfigure', template: 'chimera/menu/configure_piece'}, applySave);

	// Apply menu manager
	hawkejs.scene.on({type: 'set', template: 'chimera/menu/edit'}, function onMenu(element, variables) {

		var menuSource,
		    $wrapper,
		    newVars,
		    menuId,
		    items,
		    temp,
		    i;

		$wrapper = $('.menuManager', element);

		// Get the main menu id
		menuId = variables.menuItem.Menu._id;

		// Create variable object for rendering the nestable menu
		newVars = {
			recordItems: variables.menuItem.MenuPiece,
			menuTypes: variables.menuTypes
		};

		menuSource = {};

		for (i = 0; i < variables.menuItem.MenuPiece.length; i++) {
			temp = variables.menuItem.MenuPiece[i];
			menuSource[temp._id] = temp;
			temp.parent = temp.settings.parent;
		}

		items = treeify(menuSource, {subOrder: 'ASC', type: 'array'});
		newVars.items = items;

		// Render the HTML
		hawkejs.render('chimera/menu/nestable', newVars, function(err, result) {

			var $clonesource,
			    nestable,
			    $list;

			$wrapper.html(result);

			$clonesource = $wrapper.find('.dd-clonesource');
			$list = $wrapper.find('.nestMenu');

			// Create nestable and attach drop callback
			nestable = $list.nestable({
				dropCallback: function dropCallback(item) {
					if (String(item.sourceId).isObjectId()) {
						orderMenu(item);
					} else {
						throw new Error('Uninitialized new item piece was moved');
					}
				}
			});
			nestable.nestable('collapseAll');

			// Show piece config
			$list.on('click', '.dd3-config', function configurePiece(e) {

				// Get the item id
				var id = $(this).parent().data('id');

				// Call the configure view
				configureMenuPiece(id);

				// Prevent any browser behaviour
				e.preventDefault();
			});

			// Show clonesource items
			$clonesource.nestable({
				cloneSource: true,
				dropCallback: function dropCallback(item) {
					createMenuItem(item);
				}
			});
		});


		function createMenuItem(item) {

			var ordered,
			    baseUrl,
			    Router,
			    piece,
			    newId,
			    items,
			    nItem,
			    data,
			    tree,
			    i;

			ordered = {};
			items = [];

			// Create a new Router helper instance
			Router = new hawkejs.constructor.helpers.Router();

			baseUrl = Blast.Collection.URL.parse(Router.routeUrl('RecordAction', {
				controller: 'menu_manager',
				subject: 'menus',
				action: 'create_piece',
				id: menuId
			}));

			tree = $(item.destRoot).nestable('serialize');
			detree(items, tree);

			// Find the order for the new item
			for (i = 0; i < items.length; i++) {
				if (item.sourceId === items[i].id) {
					newNr = items.length - i;
					nItem = items[i];
					break;
				}
			}

			console.log('«««« ITEM CREATE »»»»»»')
			console.log(item);

			data = {
				type: item.sourceId,
				order: newNr
			};

			if (item.destId) {
				data.parent = item.destId;
			} else {
				data.parent = null;
			}

			// Save the order
			orderMenu(item, items);

			hawkejs.scene.openUrl(baseUrl, {
				post: {piece: data},
				history: false
			}, function result(err, result) {

				var data  = JSON.undry(result),
				    $item = $(item.sourceEl);

				$item.data('id', data.MenuPiece._id);
				//$('.dd3-content', $item).html(payload.pieceTitle);

				configureMenuPiece(data.MenuPiece._id);
			});
		};

		function orderMenu(item, items) {

			var parentId,
			    ordered,
			    baseUrl,
			    parent,
			    Router,
			    piece,
			    newId,
			    tree,
			    data,
			    i;

			ordered = {};

			// Create a new Router helper instance
			Router = new hawkejs.constructor.helpers.Router();

			baseUrl = Blast.Collection.URL.parse(Router.routeUrl('RecordAction', {
				controller: 'menu_manager',
				subject: 'menus',
				action: 'order_pieces',
				id: menuId
			}));

			if (!items) {
				// items = [];
				// tree = $(item.destRoot).nestable('serialize');
				// detree(items, tree);
				items = Object.values(menuSource);
			}

			parent = item.sourceEl.parents('.dd-item');
			parentId = parent.data('id');

			for (i = 0; i < items.length; i++) {
				data = {};
				piece = items[i];

				if (!String(piece.id).isObjectId) {
					continue;
				}

				newId = items.length - i;

				// Make sure the entry exists
				if (!menuSource[piece.id]) {
					menuSource[piece.id] = {settings: {order: -1}};
				}

				if (piece.id == item.sourceId) {
					ordered[piece.id] = {
						parent: parentId || false
					};
				}

				// Only update if the order has changed
				if (menuSource[piece.id].settings.order != newId) {

					if (!ordered[piece.id]) {
						ordered[piece.id] = {};
					}

					ordered[piece.id].order = newId;

					// Also store it in the item again, because we're not reloading the page
					menuSource[piece.id].settings.order = newId
				}
			}

			if (Object.isEmpty(ordered)) return;

			hawkejs.scene.openUrl(baseUrl, {post: {ordered: ordered}}, function(err, result) {

				if (result != 'Success') {
					chimeraFlash({message: 'Order was not saved: ' + result || err});
				}
			});
		};


		function configureMenuPiece(id, callback) {

			var madeSelection;

			vex.open({
				className: vex.defaultOptions.className + ' chimeraMenuPiece-configure',
				content: '<x-hawkejs class="" data-type="block" data-name="menuPieceConfigure"></x-hawkejs>',
				afterOpen: function($vexContent) {
					hawkejs.scene.openUrl('/chimera/menu_manager/menu_pieces/configure/'+id, {history: false}, function(err, viewRender) {

						$('.chimeraGallery-thumb', $vexContent).click(function(e) {

							var $thumb = $(this),
							    id = $thumb.data('id');

							madeSelection = true;

							if (callback) {
								callback(null, id);
							}

							vex.close();
						});
					});
				},
				afterClose: function() {
					if (!madeSelection && callback) {
						callback(null, false);
					}
				}
			});
		}
	});

	/**
	 * Convert a nestable source data tree into a simple list
	 *
	 * @author   Jelle De Loecker   <jelle@develry.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {Array}   items
	 * @param    {Object}  children
	 * @param    {String}  parent_id
	 */
	function detree(items, children, parent_id) {

		var item,
		    i;

		for (i = 0; i < children.length; i++) {

			item = children[i];

			if (parent_id) {
				item.parent = parent_id;
			}

			items.push(item);

			if (item.children) {
				detree(items, item.children, item.id);
			}

			delete item.children;
		}
	}
});