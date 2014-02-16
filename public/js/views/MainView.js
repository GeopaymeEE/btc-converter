define([
  'backbone',
  'underscore',
  'text!tpls/Main.html'
], function(
  Backbone,
  _,
  tpl
) {

  /** Important elements. */
  var elems = {
    'amountInput': 'input#amt',
    'errorText': '#oh-no',
    'orderSelect': '#buy-sell',
    'currencySelect': '#currency',
    'currencyText': '#opp-currency',
    'quoteContainer': '#quote-container',
    'progressText': '#progress',
    'quoteText': '#quote-text'
  };

  /** Main View for the BTC converter app. */
  var MainView = Backbone.View.extend({

    events: {
      'click #quote-btn': 'onClickQuoteBtn',
      'change #currency': 'onChangeCurrency'
    },

    initialize: function() {
      this.listenTo(this.model, 'bookReceived', this.onBookReceived);
      this.listenTo(this.model, 'change:quote', this.onChangeQuote);
    },

    /** When the quote button is clicked the client will try to validate
     *  the input. */
    onClickQuoteBtn: function(e) {
      var amount = $(elems['amountInput']).val();

      if (!this.isNumeric(amount) || amount < 0) {
        this.alertUser("That's not a number – try again with a number!");
        return false;
      } else if (amount <= 0) {
        this.alertUser("Please enter in a positive number.");
        return false;x
      } else {
        this.hideAlert();
        e.preventDefault();
        this.model.getOrderBook();
        this.setProgress(true);
        $(elems['quoteContainer']).hide();
      }
    },

    /** Switches #opp-currency when the current currency gets switched. */
    onChangeCurrency: function() {
      $(elems['currencyText']).html(
        (this.getCurrency() == 'USD') ? 'BTC' : 'USD');
    },

    /** Called when the book is done getting back from the ajax request. */
    onBookReceived: function() {
      var order = this.getOrder();
      if (order) {
        this.model.getQuote(order);
      }
    },

    /** Called when the user's quote gets saved/processed. */
    onChangeQuote: function(model, quote) {
      this.setProgress(false);
      if (quote.type == 'buy') {
        $(elems['quoteText']).html("The current price is "
          + Number(quote.total).toFixed(4) + " "
          + quote.currency
          + " (including " + Number(quote.commission).toFixed(4)
          + " " + quote.currency + " for commission) for your "
          + Number(quote.origAmount).toFixed(2)
          + " " + ((quote.currency == 'USD') ? 'BTC' : 'USD') + ".");
        $(elems['quoteContainer']).show();
      } else {
        $(elems['quoteText']).html("The current price is "
          + Number(quote.total).toFixed(4) + " "
          + ((quote.currency == 'USD') ? 'BTC' : 'USD')
          + " (including " + Number(quote.commission).toFixed(4)
          + " " + quote.currency + " for commission) for your "
          + Number(quote.origAmount).toFixed(2)
          + " " + quote.currency + ".");
        $(elems['quoteContainer']).show();
      }
    },

    /** Says 'working on it' or doesn't. */
    setProgress: function(isWorking) {
      $(elems['progressText']).html(isWorking ? "Working on it..." : "");
    },

    /** Compiles and returns a JS Object representing an 'order':
     *  type: 'buy' or 'sell'
     *  currency: 'USD' or 'BTC'
     *  amount: ###
     */
    getOrder: function() {
      var amount = $(elems['amountInput']).val();

      if (!this.isNumeric(amount)) {
        this.alertUser("That's not a number – try again with a number!");
      } else if (amount <= 0) {
        this.alertUser("Please enter in a positive number.");
      } else {
        this.hideAlert();
        var type = this.getOrderType();
        var currency = this.getCurrency();
        return {
          type: type,
          currency: currency,
          amount: amount
        };
      }
    },

    /** Gets the currency that the user wants to use. */
    getCurrency: function() {
      return $(elems['currencySelect']).val();
    },

    /** Returns 'buy' or 'sell', based on what the user has selected. */
    getOrderType: function() {
      return $(elems['orderSelect']).val();
    },

    /** Shows/populates #oh-no with MESSAGE. */
    alertUser: function(message) {
      var elem = $(elems['errorText']);
      elem.html(message);
      elem.show();
    },

    /** Hides the error text. */
    hideAlert: function() {
      $(elems['errorText']).hide();
    },

    /** Returns whether or not NUM is numeric. */
    isNumeric: function(num) {
      return !isNaN(parseFloat(num)) && isFinite(num);
    },

    /** Applies the HTML. */
    render: function() {
      this.applyTemplate(tpl);
    },

    /** Applies template to this View and including data thanks to
     *  Underscore. */
    applyTemplate: function(template, data) {
      data = data || {};
      data = _.extend(data, {_:_});
      var compiledTemplate = _.template(template, data);
      this.$el.html(compiledTemplate);
    },

  });

  return MainView;
});