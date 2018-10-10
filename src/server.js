// Requires
const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');
const ajaxHandler = require('./ajaxResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Variable to process the URL
const urlHandler = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
    '/redSound.mp3': mediaHandler.getRedSound,
    '/yellowSound.mp3': mediaHandler.getYellowSound,
    '/greenSound.mp3': mediaHandler.getGreenSound,
    '/blueSound.mp3': mediaHandler.getBlueSound,
    '/wrongSound.mp3': mediaHandler.getWrongSound,
    '/getGames': ajaxHandler.getGames,
    defaultResponse: ajaxHandler.notFound,
  },
  HEAD: {
    '/getGames': ajaxHandler.getGamesMeta,
  },
  POST: {
    '/createGame': ajaxHandler.addGame,
  },
};

// Processes all of the requests to the server
const onRequest = (request, response) => {
  // Parse URL
  const parsedURL = url.parse(request.url);

  // Get method in the request (GET/HEAD/POST)
  const { method } = request;

  // Process the method
  if (urlHandler[method] && urlHandler[method][parsedURL.pathname]) {
    urlHandler[method][parsedURL.pathname](request, response, parsedURL.query);
  } else {
    urlHandler.GET.defaultResponse(request, response);
  }
};

// Start server
http.createServer(onRequest).listen(port);

console.log('Server started');
