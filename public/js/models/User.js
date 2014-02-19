define(['backbone', 'models/OrderBook'], function(Backbone, OrderBook) {

  /** User model. */
  var User = Backbone.Model.extend({

    /** Default vars. */
    defaults: {
      name: "DENNIS ZHAO",
      orderBook: null,
      quote: null,
      order: null
    },

    /** Maybe pre-fetch the current BTC Price? Maybe not?... */
    initialize: function() {
      this.set('orderBook', new OrderBook());
    },

    /** Sets this User's order to ORDER. */
    setOrder: function(order) {
      this.set('order', order);
    },

    /** AJAX request to get the order book. */
    getOrderBook: function() {
      var self = this;
      this.get('orderBook').fetch({
        success: function(model, response) {
          self.set('orderBook', model);
          self.trigger('bookReceived');
        },
        error: function(model, response) {
          self.trigger('error:book', response);
        }
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
    getQuote: function() {
      var books = this.get('orderBook');
      var asks = books.get('asks');
      var bids = books.get('bids');
      var order = this.get('order');

      // Decrement this # until 0
      var amount = order.amount;
      var result = {
        amount: 0,
        origAmount: order.amount,
        commission: 0,
        type: order.type,
        currency: order.currency
      };
      var iter = 0, currAmount = 0, currValue = 0;
      if (order.type == 'buy') {
        if (order.currency == 'USD') {
          while (amount > 0) {
            currAmount = Number(asks[iter][1]);
            currValue = Number(asks[iter][0]);
            if (currAmount >= amount) {
              result.amount += amount * currValue;
              break;
            } else {
              result.amount += currAmount * currValue;
              amount -= currAmount;
            }
          }
        } else if (order.currency == 'BTC') {
          while (amount > 0) {
            currAmount = Number(asks[iter][0]);
            currValue = Number(asks[iter][1]);
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
            currAmount = Number(asks[iter][0]);
            currValue = Number(asks[iter][1]);
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
            currAmount = Number(asks[iter][1]);
            currValue = Number(asks[iter][0]);
            if (currAmount >= amount) {
              result.amount += amount * currValue;
              break;
            } else {
              result.amount += currAmount * currValue;
              amount -= currAmount;
            }
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