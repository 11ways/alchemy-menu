/**
 * The Widget Link class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.6.1
 * @version  0.6.1
 */
const Link = Function.inherits('Alchemy.Widget', 'Link');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.1
 * @version  0.6.2
 */
Link.constitute(function prepareSchema() {

	// The type of link
	this.schema.addField('link_type', 'Enum', {
		description            : 'The type of link',
		widget_config_editable : true,
		values : Classes.Alchemy.Menu.Link.Link.getDescendantsDict(),
	});

	// The link settings
	this.schema.addField('link_settings', 'Schema', {
		description            : 'The settings of this link type',
		widget_config_editable : true,
		schema                 : 'link_type',
	});

	// The title of the link (as in tooltip)
	this.schema.addField('title', 'String', {
		description            : 'The title (tooltip) of the link',
		widget_config_editable : true,
	});

	// The text content of the link
	this.schema.addField('text', 'String', {
		description            : 'The text content of the link',
		widget_config_editable : true,
	});

	this.schema.addField('target_language', 'String', {
		description            : 'What is the language of the page being linked? (Optional)',
		widget_config_editable : true,
	});

	this.schema.addField('target', 'Enum', {
		widget_config_editable : true,
		description: 'The way the link opens',
		values : {
			'_self'    : Classes.Alchemy.Microcopy('link.target_self'),
			'_blank'   : Classes.Alchemy.Microcopy('link.target_window'),
			'_parent'  : Classes.Alchemy.Microcopy('link.target_parent'),
			'_top'     : Classes.Alchemy.Microcopy('link.target_top'),
		}
	});
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.1
 * @version  0.6.2
 *
 * @param    {HTMLElement}   widget
 */
Link.setMethod(function populateWidget() {

	populateWidget.super.call(this);

	const link_type = this.config.link_type;

	if (!link_type) {
		return;
	}

	let link_constructor = Classes.Alchemy.Menu.Link.Link.getDescendant(link_type);

	if (!link_constructor) {
		throw new Error('Failed to find the Link constructor "' + link_type + '"');
	}

	let link = new link_constructor(this.config.link_settings);

	let anchor = this.createElement('a');

	link.populateWidget(anchor, this);

	if (this.config.text) {
		anchor.textContent = this.config.text;
	}

	if (this.config.title) {
		anchor.setAttribute('title', this.config.title);
	}

	if (this.config.target_language) {
		anchor.setAttribute('hreflang', this.config.target_language);
	}

	if (this.config.target) {
		anchor.setAttribute('target', this.config.target);
	}

	this.widget.classList.add('js-he-link-wrapper');

	this.widget.append(anchor);
});

/**
 * Things to do when the widget is being edited
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.6.1
 * @version  0.6.1
 *
 * @param    {HTMLElement}   widget
 */
Link.setMethod(function _startEditor() {

	if (this.widget._has_edit_events) {
		return;
	}

	this.widget._has_edit_events = true;

	this.widget.addEventListener('click', e => {
		if (this.editing) {
			e.preventDefault();
		}
	});
});