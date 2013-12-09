module.exports = function alchemyMenuHelpers(hawkejs) {
	
	// References
	var helpers = hawkejs.helpers,
	    menu    = helpers.menu = {},
	    cache   = {},
	    builder;

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
				match: {'class': 'active', parent: {'class': 'active', parent: {parent: {'class': 'active open'}}}}
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
};