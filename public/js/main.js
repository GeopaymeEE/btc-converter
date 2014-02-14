require.config({
	// *Relative* paths
	baseUrl: 'js',
	paths: {
		jquery: 'libs/jquery/jquery-1.10.2.min',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone',
		tpls: '../templates'
	},

	/** AMD shenanigans */
	shim: {
		jqueryui : {
			deps : ["jquery"],
			exports : "jQuery"
		},

		backbone : {
			deps : [ "underscore", "jquery" ],
			exports : "Backbone"
		},

		underscore : {
			exports : "_"
		}
	}

});

require(['app'], function(App) {
	App.initialize();
});