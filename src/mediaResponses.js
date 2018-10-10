// Requires
const fs = require('fs');

// Load files into memory before server starts
const redSound = fs.readFileSync(`${__dirname}/../hosted/media/redSound.mp3`);
const yellowSound = fs.readFileSync(`${__dirname}/../hosted/media/yellowSound.mp3`);
const greenSound = fs.readFileSync(`${__dirname}/../hosted/media/greenSound.mp3`);
const blueSound = fs.readFileSync(`${__dirname}/../hosted/media/blueSound.mp3`);
const wrongSound = fs.readFileSync(`${__dirname}/../hosted/media/wrongSound.mp3`);

// Function to send a response to the client
const sendResponse = (request, response, content) => {
  response.writeHead(200, { 'Content-Type': 'audio/mpeg' });
  response.write(content);
  response.end();
};

// Function to send the red sound in the response
const getRedSound = (request, response) => sendResponse(request, response, redSound);

// Function to send the yellow sound in the response
const getYellowSound = (request, response) => sendResponse(request, response, yellowSound);

// Function to send the green sound in the response
const getGreenSound = (request, response) => sendResponse(request, response, greenSound);

// Function to send the blue sound in the response
const getBlueSound = (request, response) => sendResponse(request, response, blueSound);

// Function to send the wrong sound in the response
const getWrongSound = (request, response) => sendResponse(request, response, wrongSound);

// Export the functions (make them public)
module.exports.getRedSound = getRedSound;
module.exports.getYellowSound = getYellowSound;
module.exports.getGreenSound = getGreenSound;
module.exports.getBlueSound = getBlueSound;
module.exports.getWrongSound = getWrongSound;
