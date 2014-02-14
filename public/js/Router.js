define(['backbone',
	'views/MainView',
	'models/User'
], function(
	Backbone,
	MainView,
	User
) {

	/** References an HTML elem in ../index.html that the initial (and only,
	 *	I guess) View will attach itself to. */
	var appElement = '#converter';

	var Router = Backbone.Router.extend({
		routes: {
			/** There's only one 'page'! */
			'': 'showHome',
			'*path': 'showHome'
		}
	});

	var initialize = function() {
		var router = new Router();
		var user = new User();

		// This matches 'showHome' defined above
		router.on('route:showHome', function() {
			var mainView = new MainView({
				el: appElement,
				model: user
			});

			mainView.render();
		});

		Backbone.history.start();
	};

	return {
		initialize: initialize
	};

});