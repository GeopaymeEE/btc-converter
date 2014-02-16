define(['backbone', 'underscore'], function(Backbone, _) {

  /** User model. */
  var User = Backbone.Model.extend({

    /** Default vars. */
    defaults: {
      name: "DENNIS ZHAO",
      orderBook: null,
      quote: null,
      currPrice: null
    },

    /** Maybe pre-fetch the current BTC Price? Maybe not?... */
    initialize: function() {
    },

    /** Makes a request to get current Bitcoin prices.
     *  Ok so I don't think this is even needed? */
    getBTCPrice: function() {
      var self = this;
      $.ajax({
        url: '/api/getBTCPrice',
        type: 'GET',
        dataType: 'json'
      })
      .done(function(res) {
        self.set('currPrice', res.ask);
      })
      .error(function(res) {
        console.log(res);
        self.trigger('error:price');
      });
    },

    /** AJAX request to get the order book. */
    getOrderBook: function(callback) {
      var self = this;
      $.ajax({
        url: '/api/getOrderBook',
        type: 'GET',
        dataType: 'json'
      })
      .done(function(res) {
        self.set('orderBook', res);
        self.trigger('bookReceived');
      })
      .error(function(res) {
        console.log(res);
        self.trigger('error:book');
      });
    },

    /** Processes ORDER, a JS obj, and returns a quote:
     *  ORDER:
     *  type: 'buy' or 'sell'
     *  currency: 'USD' or 'BTC'
     *  amount: ###
     *
     *  QUOTE:
     *  amount
     *  origAmount:
     *  commission: 1%
     *  type: ^
     *  currency: ^
     */
    getQuote: function(order) {
      var books = this.get('orderBook');
      var asks = books.asks;
      var bids = books.bids;

      // Decrement this # until 0
      var amount = order.amount;
      var result = {
        amount: 0,
        origAmount: order.amount,
        commission: 0,
        type: order.type,
        currency: order.currency
      };
      var iter = 0;
      if (order.type == 'buy') {
        if (order.currency == 'USD') {
          while (amount > 0) {
            var currAmount = Number(asks[iter][1]);
            var currValue = Number(asks[iter][0]);
            if (currAmount >= amount) {
              result.amount += amount * currValue;
              break;
            } else {
              result.amount += currAmount * currValue;
              amount -= currAmount;
            }
            console.log(result.amount);
          }
        } else if (order.currency == 'BTC') {
          while (amount > 0) {
            var currAmount = Number(asks[iter][0]);
            var currValue = Number(asks[iter][1]);
            if (currAmount >= amount) {
              result.amount += currValue * (amount / currAmount);
              break;
            } else {
              result.amount += currValue;
              amount -= currAmount;
            }
          }
        } else {
          this.trigger('error:order');
        }
      } else if (order.type == 'sell') {
        if (order.currency == 'USD') {
          while (amount > 0) {
            var currAmount = Number(asks[iter][0]);
            var currValue = Number(asks[iter][1]);
            if (currAmount >= amount) {
              result.amount += currValue * (amount / currAmount);
              break;
            } else {
              result.amount += currValue;
              amount -= currAmount;
            }
          }
        } else if (order.currency == 'BTC') {
          while (amount > 0) {
            var currAmount = Number(asks[iter][1]);
            var currValue = Number(asks[iter][0]);
            if (currAmount >= amount) {
              result.amount += amount * currValue;
              break;
            } else {
              result.amount += currAmount * currValue;
              amount -= currAmount;
            }
            console.log(result.amount);
          }
        } else {
          this.trigger('error:order');
        }
      } else {
        this.trigger('error:order');
      }

      result.commission = result.amount * 0.01;
      result.total = result.amount + result.commission;

      this.set('quote', result);
    }
  });

  return User;
});