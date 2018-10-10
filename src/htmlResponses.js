// Requires
const fs = require('fs');

// Load files into memory before server starts
const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);

// Function to send a response to the client
const sendResponse = (request, response, contentType, content) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

// Function to send the index in the response
const getIndex = (request, response) => sendResponse(request, response, 'text/html', index);

// Function to send the CSS in the response
const getCSS = (request, response) => sendResponse(request, response, 'text/css', css);

// Function to send the bundle in the response
const getBundle = (request, response) => sendResponse(request, response, 'application/javascript', bundle);

// Export the functions (make them public)
module.exports.getIndex = getIndex;
module.exports.getCSS = getCSS;
module.exports.getBundle = getBundle;
