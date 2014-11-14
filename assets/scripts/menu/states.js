hawkejs.require('domspot', function() {

	hawkejs.scene.on({type: 'set', template: 'menu/wrapper'}, applyMenuStates);

	$(document).ready(function() {
		// @todo: fix for initial state
		$('[data-name="menu/wrapper__main__"]').each(function() {
			applyMenuStates(this);
		});
	});

	function applyMenuStates(el) {

		var $links = $('a', el);

		$links.click(function onClick(e) {
			makeActive(this);
		});

		function makeActive(element) {

			var $this = $(element),
			    $root = $this.parents('.menu-element').last().find('a').first();

			// Remove active state from all other links
			$links.removeClass('active');

			// And add it for the clicked link
			$this.addClass('active');

			if (!$root.is($this)) {
				$root.addClass('active');
			}
		}

		makeActive($links.filter('[href="' + window.location.pathname + '"]'));
	}
});