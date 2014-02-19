define(['backbone'], function(Backbone) {

  var OrderBook = Backbone.Model.extend({

    defaults: {
      timestamp: 0,

      // Array of bids
      bids: null,

      // Array of asks
      asks: null
    },

    url: '/api/getOrderBook'
  });

  return OrderBook;

});