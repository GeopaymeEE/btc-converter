var http = require('http'),
    express = require('express'),
    path = require('path'),
    request = require('request');

var app = express();

// Configure Express
app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser()),
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

/** Returns info about the current BTC rate from BitStamp's APIs
 *  Returns JSON dictionary of:
 *    last: last BTC price
 *    high: last 24 hr high
 *    low:  last 24 hr low
 *    volume: last 24 hr volume
 *    bid:  highest buy order
 *    ask: lowest sell order
 */
app.get('/api/getBTCPrice', function(req, res) {
  request('https://www.bitstamp.net/api/ticker/', function(error, response, body) {
    if (error) {
      console.log('Error getting BTC: ' + error);
      return;
    } else {
      res.send(body);
    }
  });
});

app.get('/api/getOrderBook', function(req, res) {
  request('https://www.bitstamp.net/api/order_book/', function(error,
    response, body) {
    if (error) {
      console.log('Error getting order book: ' + error);
      return;
    } else {
      res.send(body);
    }
  })
});

/** Returns a quote given a 'order' query of type, currency, and amount. */
/*
app.get('/api/getQuote', function(req, res) {
  var type = req.query.type;
  var currency = req.query.currency;
  var amount = req.query.amount;

  if (type && currency && amount) {
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
          var currAmount = Number(asks[iter][1]);
          var currValue = Number(asks[iter][0]);
          if (currAmount >= amount) {
            // Multiply by amount, add to total
            result.amount += amount * currValue;
          } else {
            // currAmount < amount
            result.amount += currAmount * currValue;
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
      }
    } else {
    }
  } else {
    res.send(400, 'Invalid request... hmm');
  }
});
*/

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express listening on port " + app.get('port'));
});
