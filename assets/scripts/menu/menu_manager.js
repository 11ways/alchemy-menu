hawkejs.require('chimera/chimera', function() {
	hawkejs.scene.on({type: 'set', name: 'menuPieceConfigure', template: 'chimera/menu/configure_piece'}, applySave);

	hawkejs.scene.on({type: 'set', template: 'chimera/menu/edit'}, function onMenu(element, variables) {

		var $wrapper = $('.menuManager', element),
		    newVars;

		newVars = {
			items: variables.menuItem.MenuPiece,
			menuTypes: variables.menuTypes
		};

		hawkejs.render('chimera/menu/nestable', newVars, function(err, result) {

			var $list;

			$wrapper.html(result);

			$list = $wrapper.find('.nestMenu');

			$list.nestable().nestable('collapseAll');

			$('.nestMenu-config', $list).click(function(e) {

				var id = $(this).parent().data('id');

				configureMenuPiece(id);

				e.preventDefault();
			});

			console.log(err);
			console.log(result);

		});


		console.log(element);
		console.log(variables);
	});

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