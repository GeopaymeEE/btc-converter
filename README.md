## BTC Converter

BTC to USD (and back) converter. Uses node.js, express, request, backbone.js, and Bitstamp's APIs to fetch live BTC values.

I was given a 3 hour time limit to make the app, given instructions and a URL to Bitstamp's API docs! Really fun internship process although it was a little bit out of my comfort zone with regards to how other companies run their internship interview processes.

I made some important changes to the codebase, some of which I've outlined below:

- Re-defined an OrderBook as its own Model. I think it makes more sense for it to have its own model so that methods related to manipulating OrderBooks can be kept within the OrderBook 'class'.
- Moved some logic around to put things where they should be... bound relevant data to the relevant models.