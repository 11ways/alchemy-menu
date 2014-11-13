module.exports = function alchemyMenuHelpers(Hawkejs, Blast) {

	var Menu = Hawkejs.Helper.extend(function MenuHelper(view) {
		Hawkejs.Helper.call(this, view);
	});

	/**
	 * Output a menu
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  1.0.0
	 *
	 * @param    {String}    name         The name of the menu
	 * @param    {Object}    options      Extra options
	 */
	Menu.setMethod(function get(name, options) {

		var that = this;

		this.view.async(function getMenu(next) {
			that.view.helpers.Alchemy.getResource('menu', {name: name}, function gotResult(err, pieces) {

				var tree = treeify(pieces),
				    placeholder;

				placeholder = that.view.print_element('menu/wrapper', {items: Object.values(tree)});

				placeholder.getContent(next);
			});
		});
	});

	return;
	// References
	var helpers = hawkejs.helpers,
	    menu    = helpers.menu = {},
	    cache   = {},
	    builder,
	    nestableMenuBuilder,
	    nestableBuilder;

	/**
	 * Build the menu
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	builder = function builder(result, options, insert) {
		
		var i, html = '', entry;

		if (typeof options !== 'object') {
			options = {};
		} else {
			// clone the options object
			options = JSON.parse(JSON.stringify(options));
		}

		if (!options.level) options.level = 0;
		options.level++;
		
		if (options.level == 1) {
			html = options.rootOpen || '';
		} else {
			html = options.childrenOpen || '';
		}

		// @todo: implement children & section opens

		for (i = 0; i < result.length; i++) {

			entry = result[i];

			if (!entry.contentPrepend) {
				entry.contentPrepend = '<span>';

				if (entry.icon) {
					entry.contentPrepend += '<i class="fa fa-' + entry.icon + '"></i> ';
				}
			}

			if (!entry.contentAppend) {
				entry.contentAppend = '</span>';
			}

			if (entry.children && entry.children.length) {
				html += options.sectionOpen || '';
			} else {
				html += options.singleOpen || '';
			}

			entry.contentPrepend += '<span class="menu-item-text">';
			entry.contentAppend = '</span>' + entry.contentAppend;

			html += this.add_link(entry.url, {
				'prepend': entry.contentPrepend,
				'append': entry.contentAppend,
				'name': entry.title,
				'return': 'string',
				match: {
					greedy: entry.greedy,
					'class': 'active',
					parent: {
						'class': 'active',
						parent: {
							parent: {
								'class': 'active open'}}}}
			});

			if (entry.children && entry.children.length) {

				html += builder.call(this, entry.children, options);

				html += options.sectionClose || '';
			} else {
				html += options.singleClose || '';
			}
		}

		if (options.level == 1) {
			html += options.rootClose || '';
		} else {
			html += options.childrenClose || '';
		}

		if (insert) {
			insert(html);
		}

		if (options['return'] || !insert) {
			return html;
		}
	};

	/**
	 * Get the url for a connection name
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.1.0
	 * @version  0.1.0
	 *
	 * @param    {String}    connection
	 * @param    {Object}    options
	 */
	menu.url = function url(connection, options) {

		var template = this.__storageVars.linkMap[connection];

		if (!template) {
			return '';
		}

		return template.fillPlaceholders(options);
	};

	/**
	 * Print the link for the given connection
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.1.0
	 * @version  0.1.0
	 *
	 * @param    {String}    connection
	 * @param    {Object}    options
	 */
	menu.link = function link(connection, options) {

		var url = menu.url.call(this, connection, options);

		this.add_link(url, {name: options.name});
	};

	/**
	 * Output a menu
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {String}    menuName     The name of the menu
	 * @param    {Object}    options      Extra options
	 */
	menu.get = function menu_get(menuName, options) {

		if (typeof options !== 'object') {
			options = {};
		}

		var that = this,
		    req  = this.hawkejs.req,
		    ttl;

		// If no ttl is given in the options, default to 1 hour
		if (typeof options.ttl === 'undefined') {
			ttl = 1 * 60 * 60 * 1000;
		} else {
			ttl = options.ttl;
		}

		// Push a placeholder into the generated view
		this.async(function(insert) {

			var entry;

			if (that.ClientSide && cache[menuName]) {
				entry = cache[menuName];

				// If the cache isn't too old, use that
				if ((Date.now() - entry.time) < ttl) {
					builder.call(that, entry.result, options, insert);
					return;
				}
			}

			// Get the resource from the server
			hawkejs.getResource('menu', {name: menuName, req: req}, function(result) {

				// Store it in the cache on the client side
				if (that.ClientSide) {
					cache[menuName] = {
						time: Date.now(),
						result: result
					};
				}

				builder.call(that, result, options, insert);
			});
		});
	};

	/**
	 * Create the nestable html
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 */
	nestableMenuBuilder = function nestableMenuBuilder(items) {

		var item,
		    classes,
		    html = '<div class="dd" id="nestable-menu"><ol class="dd-list">',
		    i;

		for (i = 0; i < items.length; i++) {
			item = items[i];

			if (item.allowChildren) {
				classes = '';
			} else {
				classes = 'dd-nochildren';
			}

			html += '<li class="dd-item ' + classes + '" data-id="' + item.id + '">';
			html += '<div class="dd3-config"><i class="fa fa-wrench"></i></div>';
			html += '<div class="dd-handle dd3-content">' + item.type + '</div>';

			if (item.children && item.children.length) {
				html += nestableBuilder(item.children);
			}

			html += '</li>';
		}

		html += '</ol></div>';

		// Create the clone source
		html += '<div id="nestable-source" class="dd dd-clonesource dd-nodrop"><ol class="dd-list">';
		html += '<li class="dd-item dd-nochildren" data-id="new">';
		html += '<div class="dd3-config"><i class="fa fa-wrench"></i></div>';
		html += '<div class="dd-handle dd3-content">Test</div>';
		html += '</li>';
		html += '</ol></div>';


		html += '<script>setTimeout(function(){$("#nestable-menu").nestable({dropCallback: ' + String(dropCallback) + '});';
		html += '$(".dd-clonesource").nestable({cloneSource: true});}, 200);</script>';

		return html;
	};

	/**
	 * Create nestable html
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {Object}     items       The items object
	 * @param    {Object}    options      Extra options
	 */
	nestableBuilder = function nestableBuilder(items, options) {

		var html = '',
		    obj  = items,
		    subOptions,
		    classes,
		    item,
		    cb,
		    i,
		    j;

		if (!options) {
			options = {};
		}

		// Only do this in the root, not for children
		if (!options.children) {

			// Create an ordered array out of the object
			items = hawkejs.order(items, {subOrder: 'ASC'});
			items = hawkejs.treeify(items);

			if (!options.config) {
				options.config = {};
			}

			if (!options.config.dropCallback) {
				options.config.dropCallback = function dropCallback(item) {
					hawkejs.event.emit('menu-manager-drop', item);
				};
			}
		}

		// What property to use for the li title?
		if (!options.lititle) {
			options.lititle = 'title';
		}

		// Add the wrapping div if these are not children
		if (!options.children) {

			// Create an id
			if (!options.id) {
				options.id = Date.now() + '-' + (~~(Math.random()*1000));
			}

			// Open the div and add css classes
			html += '<div class="dd';

			if (options['classes']) {
				html += ' ' + options['classes'];
			}

			html += '"';

			// Add the id if needed
			html += ' id="' + options.id + '"';

			// Finish the wrapping div
			html += '>';
		}

		// Finish the opening tag + add the ol tag
		html += '<ol class="dd-list">';

		// Start adding the children
		for (i = 0; i < items.length; i++) {
			item = items[i];

			if (item.allowChildren) {
				classes = '';
			} else {
				classes = 'dd-nochildren';
			}

			if (options.liclasses) {
				classes += ' ' + options.liclasses;
			}

			html += '<li class="dd-item ' + classes + '" data-id="' + item.id + '">';

			if (typeof options.liicon !== 'undefined') {
				html += '<div class="dd3-config"><i class="fa fa-' + options.liicon + '"></i></div>';
				html += '<div class="dd-handle dd3-content"><span class="text">' + item[options.lititle] + '</span></div>';
			} else {
				html += '<div class="dd-handle"><span class="text">' + item[options.lititle] + '</span></div>';
			}

			if (options.actions) {
				if (!Array.isArray(options.actions)) {
					options.actions = [options.actions];
				}

				for (j = 0; j < options.actions.length; j++) {
					html += '<div class="dd3-extra action-' + options.actions[j] + '" style="right:' + 30*j + 'px"><i class="fa fa-' + options.actions[j] + '"></i></div>';
				}
			}

			if (item.children && item.children.length) {

				// Clone the options object
				subOptions = JSON.parse(JSON.stringify(options));

				// Indicate this is a children nestable menu
				subOptions.children = true;

				html += nestableBuilder(item.children, subOptions);
			}

			html += '</li>';
			
		}

		// Close the ordered list
		html += '</ol>';

		// If these are not children, close the wrapping div
		if (!options.children) {
			html += '</div>';

			// Add the constructing script
			html += '<script>setTimeout(function(){$("#' + options.id + '").nestable(' + hawkejs.uneval(options.config) + ').nestable("collapseAll");}, 150);</script>';
		}

		return html;
	};

	/**
	 * Create a nestable view of the menu
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {Object}    options      Extra options
	 */
	menu.nestable = function menu_nestable(options) {

		var that = this,
		    req  = this.hawkejs.req,
		    ttl;

		this.asset.script(['menu/jquery.nestable'], {block: 'head'});
		this.asset.style(['menu/nestable'], {block: 'head'});

		this.echo(nestableBuilder(this.menuSource, {
			id: 'nestable-menu-editor',
			lititle: 'title',
			liicon: 'wrench',
			actions: ['trash-o']
		}));
	};

	/**
	 * Create the nestable source items
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {Object}    options      Extra options
	 */
	menu.nestableSource = function menu_nestable_source(options) {

		var that = this,
		    req  = this.hawkejs.req,
		    ttl;

		this.asset.script(['menu/jquery.nestable'], {block: 'head'});
		this.asset.style(['menu/nestable'], {block: 'head'});

		this.echo(nestableBuilder(this.MenuItemTypes, {
			liicon: 'wrench',
			classes: 'dd-clonesource dd-nodrop',
			config: {cloneSource: true}
		}));
	};
};

function treeify(obj, options) {

	var originalArray = Array.isArray(obj),
	    store = {},
	    list  = [],
	    parentKey,
	    filtered,
	    parent,
	    item,
	    tree,
	    key,
	    i;

	if (!options) {
		options = {};
	}

	if (!options.key) {
		options.key = 'id';
	}

	if (!options.parent) {
		options.parent = 'parent';
	}

	if (!options.children) {
		options.children = 'children';
	}

	if (!options.childrenType) {
		options.childrenType = 'auto';
	} else {
		if (options.childrenType.toLowerCase() == 'array') {
			options.childrenType = 'array';
		} else {
			options.childrenType = 'object';
		}
	}

	// Make sure we have an object with the keys and an array
	if (originalArray) {

		if (options.childrenType == 'auto') {
			options.childrenType = 'array';
		}

		for (i = 0; i < obj.length; i++) {

			// Make sure the item has a key
			if (!obj[i][options.key]) {
				obj[i][options.key] = i;
			}

			store[obj[i][options.key]] = obj[i];
		}

		list = obj.slice(0);
	} else {

		if (options.childrenType == 'auto') {
			options.childrenType = 'object';
		}

		for (key in obj) {

			// Make sure the item has a key
			if (!obj[key][options.key]) {
				obj[key][options.key] = key;
			}

			store[obj[key][options.key]] = obj[key];
			list.push(obj[key]);
		}
	}

	if (typeof options.childrenType !== 'function') {
		options.childrenType = 'array';
	}

	// Treeify the results
	for (i = 0; i < list.length; i++) {
		item = list[i];
		parentKey = item[options.parent];

		// See if the wanted parent is actually in the object
		if (store[parentKey]) {
			parent = store[parentKey];

			if (options.childrenType == 'array') {
				if (!parent[options.children] || ! Array.isArray(parent[options.children])) {
					parent[options.children] = [];
				}

				parent[options.children].push(item);
			} else {
				if (typeof parent[options.children] !== 'object') {
					parent[options.children] = {};
				}

				parent[options.children][item[options.key]] = item;
			}
		}
	}

	if (originalArray || options.type === 'array') {
		filtered = list.filter(function(element) {
			// If the element has a parent set, remove it from the list
			if (element[options.parent]) {
				return false;
			} else {
				return true;
			}
		});

		return filtered;
	} else {
		for (key in store) {
			if (store[key].parent) {
				delete store[key];
			}
		}

		return store;
	}
}