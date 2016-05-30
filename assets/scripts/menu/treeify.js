/**
 * Turn an object or array into a tree.
 * Orphans will be removed.
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.0.10
 * @version  0.0.10
 *
 * @param    {Object}   obj        The object or array to treeify
 * @param    {Object}   options
 * 
 * @return   {Object}              An object or array containing the tree
 */
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