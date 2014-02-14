define(['jquery', 'underscore', 'backbone', 'Router'],
	function($, _, Backbone, Router) {

	var initialize = function() {
		Router.initialize();
	};

	return {
		initialize : initialize
	};
});