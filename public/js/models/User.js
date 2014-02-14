define(['backbone', 'underscore'], function(Backbone, _) {

  /** User model. */
  var User = Backbone.Model.extend({

    /** Default vars. */
    defaults: {
      name: "DENNIS ZHAO",
      orderBook: null,
      quote: null
    },

    /** Maybe pre-fetch the current BTC Price? Maybe not?... */
    initialize: function() {
      // this.getBTCPrice();
      // this.getOrderBook();
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
        // console.log(res);
      })
      .error(function(res) {
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
      console.log(amount);
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
          // Wants to BUY USD with BTC

          // Continue until amount == 0
          while (amount > 0) {
            var currAmount = Number(asks[iter][1]);
            var currValue = Number(asks[iter][0]);
            if (currAmount >= amount) {
              // Multiply by amount, add to total
              result.amount += amount * currValue;
              break;
            } else {
              // currAmount < amount
              result.amount += currAmount * currValue;
              amount -= currAmount;
            }
            console.log(result.amount);
          }
        } else if (order.currency == 'BTC') {
          // Wants to BUY BTC with USD

          // Continue until amount == 0
          while (amount > 0) {
            var currAmount = Number(asks[iter][0]);
            var currValue = Number(asks[iter][1]);
            if (currAmount >= amount) {
              // Multiply by amount, add to total
              result.amount += currValue * (amount / currAmount);
              break;
            } else {
              // currAmount < amount
              result.amount += currValue;
              amount -= currAmount;
            }
          }
        } else {
          this.trigger('error:order');
        }
      } else if (order.type == 'sell') {
        if (order.currency == 'USD') {

        } else if (order.currency == 'BTC') {

        } else {
          this.trigger('error:order');
        }
      } else {
        this.trigger('error:order');
      }
      // Add commission
      result.commission = result.amount * 0.01;
      this.set('quote', result);
    }
  });

  return User;
});