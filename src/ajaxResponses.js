// Requires
const utilities = require('./utilities.js');

// Variable to hold POST data
const data = [];

// Function to send response back to the client
const sendResponse = (request, response, code, content) => {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  if (content) response.write(JSON.stringify(content));
  response.end();
};

// Function to send a 404 Not Found response
const notFound = (request, response) => {
  const content = {
    id: 'notFound',
    message: 'The page you are looking for is not found.',
  };

  sendResponse(request, response, 404, content);
};

// Function to send the headers for the games
const getGamesMeta = (request, response) => sendResponse(request, response, 200, null);

// Function to send the game data back to the client
const getGames = (request, response, query) => {
  // Get a copy of the data
  const games = data.concat();

  // Filter content by name A-Z
  if (query && query.includes('filter=a-z')) {
    utilities.sort(games);
  } else if (query && query.includes('filter=z-a')) {
    // Filter content by name Z-A
    utilities.reverseSort(games);
  }

  // Put the array into an object and send the response
  const content = { games };
  sendResponse(request, response, 200, content);
};

// Function to add a game to the array of games
const addGame = (request, response, body) => {
  let code = 0;
  let content = {};

  // 400 - Bad Request
  if (body.length === 0) {
    code = 400;
    content.id = 'badRequest';
    content.message = 'Must have at least 1 pattern.';
  } else {
    let index = -1;

    // Check if name already exists
    for (let i = 0; i < data.length; i++) {
      if (body.name === data[i].name) {
        index = i;
        break;
      }
    }

    // 201 - Created (name doesn't already exist)
    if (index === -1) {
      code = 201;
      content.message = 'Created successfully.';

      data.push(body);
    } else {
      // 204 - Updated (name already exists)
      code = 204;
      content = null;

      data[index] = body;
    }
  }

  sendResponse(request, response, code, content);
};

// Function to process post requests
const processPostRequests = (request, response) => {
  // Array to hold stream of data sent
  const body = [];

  // Error event
  request.on('error', () => {
    response.statusCode = 400;
    response.end();
  });

  // Data event (getting stream of data from the request)
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // End event (finished getting all of the data in the stream/body of request)
  request.on('end', () => {
    // Convert the data in the body of the request into a string
    const bodyString = Buffer.concat(body).toString();

    // Convert the string into JSON, since the body of the request has JSON
    const json = JSON.parse(bodyString);

    // Add game
    addGame(request, response, json);
  });
};

// Export the functions (make them public)
module.exports.notFound = notFound;
module.exports.getGamesMeta = getGamesMeta;
module.exports.getGames = getGames;
module.exports.addGame = processPostRequests;
