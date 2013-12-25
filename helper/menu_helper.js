module.exports = function alchemyMenuHelpers(hawkejs) {
	
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


		html += '<script>$("#nestable-menu").nestable();$(".dd-clonesource").nestable({cloneSource: true});</script>';

		return html;
	};

	/**
	 * Create nestable html
	 *
	 * @author   Jelle De Loecker   <jelle@codedor.be>
	 * @since    0.0.1
	 * @version  0.0.1
	 *
	 * @param    {Array}     items        The items
	 * @param    {Object}    options      Extra options
	 */
	nestableBuilder = function nestableBuilder(items, options) {

		var html = '',
		    subOptions,
		    classes,
		    item,
		    i;

		if (!options) {
			options = {};
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
				html += '<div class="dd-handle dd3-content">' + item[options.lititle] + '</div>';
			} else {
				html += '<div class="dd-handle">' + item[options.lititle] + '</div>';
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

			if (!options.config) {
				options.config = {};
			}

			// Add the constructing script
			html += '<script>$("#' + options.id + '").nestable(' + JSON.stringify(options.config) + ');</script>';
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
			lititle: 'type',
			liicon: 'wrench'
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

		return;

		var that = this,
		    req  = this.hawkejs.req,
		    ttl;

		this.asset.script(['menu/jquery.nestable'], {block: 'head'});
		this.asset.style(['menu/nestable'], {block: 'head'});

		nestableBuilder(this.menuSource);
	};
};