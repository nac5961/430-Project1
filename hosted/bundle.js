"use strict";

var pattern = [];
var maxLength = 30;

var games = [];
var game = [];
var gameOver = false;

//Function to play a sound effect when a color is clicked
var playSound = function playSound(color) {
	//Create audio element (never append to page since we just want to play it)
	var soundEffect = document.createElement("audio");

	//Set src according to color
	switch (color) {
		case 'Red':
			soundEffect.src = document.getElementById("redSound").src;
			break;
		case 'Yellow':
			soundEffect.src = document.getElementById("yellowSound").src;
			break;
		case 'Green':
			soundEffect.src = document.getElementById("greenSound").src;
			break;
		case 'Blue':
			soundEffect.src = document.getElementById("blueSound").src;
			break;
		default:
			soundEffect.src = document.getElementById("wrongSound").src;
			break;
	}

	//Play sound
	soundEffect.play();
};

//Function to setup callback events for all UI
var setupUI = function setupUI() {
	//Color picker for making the game
	var redPicker = document.getElementById('red-pick');
	var yellowPicker = document.getElementById('yellow-pick');
	var greenPicker = document.getElementById('green-pick');
	var bluePicker = document.getElementById('blue-pick');

	//Color picker for playing the game
	var red = document.getElementById('red');
	var yellow = document.getElementById('yellow');
	var green = document.getElementById('green');
	var blue = document.getElementById('blue');

	//Form
	var gameForm = document.getElementById('input-container');

	//Buttons
	var cancelButton = document.getElementById('cancel-button');
	var findButton = document.getElementById('find-button');

	/* Color Picker Event Listeners For Making the Game */
	//Store red choice and play sound
	redPicker.onclick = function () {
		playSound('Red');
		updatePattern('Red');
	};

	//Store yellow choice and play sound
	yellowPicker.onclick = function () {
		playSound('Yellow');
		updatePattern('Yellow');
	};

	//Store green choice and play sound
	greenPicker.onclick = function () {
		playSound('Green');
		updatePattern('Green');
	};

	//Store blue choice and play sound
	bluePicker.onclick = function () {
		playSound('Blue');
		updatePattern('Blue');
	};

	/* Color Picker Event Listeners For Playing the Game */
	//Check Red Choice 
	red.onclick = function () {
		if (!gameOver) {
			checkChoice('Red');
		}
	};

	//Check Yellow Choice
	yellow.onclick = function () {
		if (!gameOver) {
			checkChoice('Yellow');
		}
	};

	//Check Green Choice
	green.onclick = function () {
		if (!gameOver) {
			checkChoice('Green');
		}
	};

	//Check Blue Choice
	blue.onclick = function () {
		if (!gameOver) {
			checkChoice('Blue');
		}
	};

	/* Form Event Listeners */
	//Send POST request with data
	gameForm.onsubmit = function (e) {
		//Get method and url to send in AJAX request
		var method = gameForm.getAttribute('method');
		var url = gameForm.getAttribute('action');

		//Send AJAX request and clear data
		sendRequest(method, url);
		clearPattern();

		//Cleat input
		document.getElementById('name-input').value = '';

		//Prevent the form from submitting and changing the page
		e.preventDefault();
		return false;
	};

	/* Button Event Listeners */
	//Clear pattern
	cancelButton.onclick = function () {
		clearPattern();
	};

	//Send GET request for data
	findButton.onclick = function () {
		//Send GET request to server using the filter query
		var url = document.getElementById('filter').value;
		sendRequest('GET', url);
	};
};

//Function to clear the pattern data and stop displaying it
var clearPattern = function clearPattern() {
	pattern = [];
	document.getElementById('pattern-text').innerHTML = '';
};

//Function to update the pattern data and display it
var updatePattern = function updatePattern(color) {
	//Prevent going over max length
	if (pattern.length === maxLength) return;

	//Get reference to pattern text
	var patternText = document.getElementById('pattern-text');

	//Special Case: 1st entry - display color
	if (pattern.length === 0) {
		patternText.innerHTML = color;
	}

	//Normal Case: Other entries - display color and comma separate them
	else {
			patternText.innerHTML += ", " + color;
		}

	//Add color to array of pattern
	pattern.push(color);
};

//Helper function to create an element with a class
var createElement = function createElement(elementName, className) {
	//Create element
	var newElement = document.createElement(elementName);

	//Add class if one was provided
	if (className) newElement.classList.add(className);

	return newElement;
};

//Function to build the HTML for the returned games
var buildResult = function buildResult(json) {
	if (json.games && json.games.length != 0) {
		//Clear the saved list of games to re-populate
		games = [];

		//Clear the display of results to re-populate
		var resultsDiv = document.getElementById('results-container');
		resultsDiv.innerHTML = '';

		for (var i = 0; i < json.games.length; i++) {
			//Get the current game
			var currGame = json.games[i];

			//Add game to the list
			games.push(currGame.pattern);

			//Create all elements
			var result = createElement('div', 'result');

			var resultNameContainer = createElement('div', 'result-text-container');
			var resultName = createElement('p', 'result-text');

			var optionsContainer = createElement('div', 'options-container');
			var optionsSubContainer = createElement('div', 'options-sub-container');
			var difficulty = createElement('select', 'difficulty');
			var normalOption = createElement('option');
			var fastOption = createElement('option');
			var playButton = createElement('button', 'play-button');

			var resultLengthContainer = createElement('div', 'result-text-container');
			var resultLength = createElement('p', 'result-text');

			//Assign all elements values if needed
			resultName.textContent = currGame.name;

			difficulty.id = "difficulty-" + i;
			normalOption.textContent = 'Speed: Normal';
			normalOption.value = .8;
			fastOption.textContent = 'Speed: Fast';
			fastOption.value = .3;
			playButton.textContent = 'Play';
			playButton.name = i; //set index of game to play it

			resultLength.textContent = "Length: " + currGame.length;

			//Setup play button event listener
			playButton.onclick = function (e) {
				//Get a copy of the game to play
				game = games[e.target.name].concat(); //button name is the index of the game

				//Get the value of the difficulty associated with this play button
				var speed = document.getElementById("difficulty-" + e.target.name).value;

				//Set the speed
				setSpeed(speed);

				//Make sure game over is reset
				gameOver = false;

				//Switch to the game screen
				switchScreens('main', 'game');
			};

			//Parent all of the elements
			result.appendChild(resultNameContainer);
			result.appendChild(optionsContainer);
			result.appendChild(resultLengthContainer);

			resultNameContainer.appendChild(resultName);

			optionsContainer.appendChild(optionsSubContainer);
			optionsSubContainer.appendChild(difficulty);
			optionsSubContainer.appendChild(playButton);
			difficulty.appendChild(normalOption);
			difficulty.appendChild(fastOption);

			resultLengthContainer.appendChild(resultLength);

			//Append the result to the page
			resultsDiv.appendChild(result);
		}
	}
};

//Function to handle the response from the server
var processResponse = function processResponse(xhr, method) {
	//Display data returned from GET request
	if (method === 'get') {
		var json = JSON.parse(xhr.response);
		buildResult(json);
	}
};

//Function to send request to the server
var sendRequest = function sendRequest(method, url) {
	//Standardize the method to not worry about casing
	method = method.toLowerCase();

	//Create xhr object to send request
	var xhr = new XMLHttpRequest();

	//Set method and url for sending the request
	xhr.open(method, url);

	//Setup callback
	xhr.onload = function () {
		return processResponse(xhr, method);
	};

	//Set accept header (data we want to get back from the server)
	xhr.setRequestHeader('Accept', 'application/json');

	if (method === 'post') {
		//Set content-type header (data we are sending to the server)
		xhr.setRequestHeader('Content-Type', 'application/json');

		//Set data to send to the server
		var formData = {};
		formData.pattern = pattern;
		formData.name = document.getElementById('name-input').value;
		formData.length = pattern.length;

		//Send POST request to server with data
		xhr.send(JSON.stringify(formData));
	} else {
		//Send GET/HEAD request to server
		xhr.send();
	}
};

//Initialization
var init = function init() {
	setupUI();
};

window.onload = init;
'use strict';

var screenTransitionTime = 1000; //milliseconds, must match CSS
var statusTransitionTime = 500; //milliseconds, must match CSS
var colorTransitionTime = 1000; //milliseconds, will be getting set in SetSpeed

//Function to change the transition speed based on the difficulty
var setSpeed = function setSpeed(speed) {
	//Set transition time based on the speed
	colorTransitionTime = 1000 * speed; //in milliseconds

	//Update all colors
	document.getElementById('red').style.transition = 'background-color ' + speed + 's';
	document.getElementById('yellow').style.transition = 'background-color ' + speed + 's';
	document.getElementById('green').style.transition = 'background-color ' + speed + 's';
	document.getElementById('blue').style.transition = 'background-color ' + speed + 's';
};

//Function to countdown for the game to start
var beginCountdown = function beginCountdown() {
	//Get reference to the game status element
	var gameStatus = document.getElementById('game-status');

	var countDownTime = 4;
	var timer = 0;

	//Set text to beginning of countdown
	gameStatus.textContent = 'Game starts in ' + countDownTime + ' . . .';

	var _loop = function _loop(i) {
		//Space out the countdown display by one second to resemble an actual countdown
		timer += 1000;

		//Complete the countdown
		setTimeout(function () {
			gameStatus.textContent = 'Game starts in ' + i + ' . . .';
		}, timer);
	};

	for (var i = countDownTime - 1; i > 0; i--) {
		_loop(i);
	}

	//Add another second since we stopped at 1 in the loop
	timer += 1000;

	//Play the game
	//Switch status and begin to show the pattern
	setTimeout(function () {
		//Switch status
		switchStatus('Watch Closely');

		//Display the pattern to match
		displayPattern();
	}, timer);
};

//Function to display the pattern that the player has to copy
var displayPattern = function displayPattern() {
	var timer = 0;
	var interval = colorTransitionTime * 2; //double time to fade in and out before next color

	var _loop2 = function _loop2(i) {
		//Space out displays
		timer += interval;

		//Fade the color in and out
		setTimeout(function () {
			fadeInAndOutColor(game[i]);
		}, timer);
	};

	for (var i = 0; i < game.length; i++) {
		_loop2(i);
	}

	//Add more time to allow the last color to finish
	timer += interval;

	//Finished the pattern - Get the player ready to start playing
	//Switch status and begin to show the pattern
	setTimeout(function () {
		//Switch status
		switchStatus("Copy the pattern");

		//Enable the game screen to let the player play
		enableGameScreen();
	}, timer);
};

//Function to fade the color in and out when showing the pattern
var fadeInAndOutColor = function fadeInAndOutColor(color) {
	//Get reference to the div associated with the color
	var colorDiv = document.getElementById(color.toLowerCase());

	//Fade in the color
	switch (color) {
		case 'Red':
			colorDiv.classList.add('redColor');
			colorDiv.classList.remove('lightRedColor');
			break;
		case 'Yellow':
			colorDiv.classList.add('yellowColor');
			colorDiv.classList.remove('lightYellowColor');
			break;
		case 'Green':
			colorDiv.classList.add('greenColor');
			colorDiv.classList.remove('lightGreenColor');
			break;
		case 'Blue':
			colorDiv.classList.add('blueColor');
			colorDiv.classList.remove('lightBlueColor');
			break;
		default:
			break;
	}

	//Play sound just before color fully fades in (this is a timing issue)
	setTimeout(function () {
		playSound(color);
	}, colorTransitionTime / 2);

	//Begin the process of fading out
	setTimeout(function () {
		//Fade out
		switch (color) {
			case 'Red':
				colorDiv.classList.remove('redColor');
				colorDiv.classList.add('lightRedColor');
				break;
			case 'Yellow':
				colorDiv.classList.remove('yellowColor');
				colorDiv.classList.add('lightYellowColor');
				break;
			case 'Green':
				colorDiv.classList.remove('greenColor');
				colorDiv.classList.add('lightGreenColor');
				break;
			case 'Blue':
				colorDiv.classList.remove('blueColor');
				colorDiv.classList.add('lightBlueColor');
				break;
			default:
				break;
		}
	}, colorTransitionTime);
};

//Function to check if the player got the pattern correct
var checkChoice = function checkChoice(color) {
	//Player is right - continue with the game
	if (game[0] === color) {
		//play sound effect
		playSound(color);

		//Remove the item guessed correctly
		game.shift();

		//Player won - switch to win screen
		if (game.length === 0) {
			//Mark that the game has ended
			gameOver = true;

			//Display win message
			switchStatus("You Won!!");
		}
	}

	//Player is wrong - switch to game over screen
	else {
			//play wrong sound effect
			playSound();

			//Mark that the game has ended
			gameOver = true;

			//Display game over message
			switchStatus("Game Over!!");
		}
};

//Function to make the game screen clickable after the pattern is shown
var enableGameScreen = function enableGameScreen() {
	//Get reference to game screen
	var gameScreen = document.getElementById('game');

	//Enable clicking on the game screen
	gameScreen.style.pointerEvents = "auto";
};

//Function to switch the text that displays the status of the game
var switchStatus = function switchStatus(statusText) {
	//Get reference to the game status element
	var gameStatus = document.getElementById('game-status');

	//Fade out the game status
	gameStatus.style.opacity = 0;

	//Complete the status switch
	setTimeout(function () {
		//Set the new text to display
		gameStatus.textContent = statusText;

		//Fade in the game status
		gameStatus.style.opacity = 1;

		//Exit the game once the game is over
		if (gameOver === true) {
			setTimeout(function () {
				switchScreens('game', 'main');
			}, 4000);
		}
	}, statusTransitionTime); //time must match css transition time
};

//Function to switch from one screen to the next
var switchScreens = function switchScreens(screen1, screen2) {
	//Get the screens
	var firstScreen = document.getElementById(screen1);
	var secondScreen = document.getElementById(screen2);

	//Fade out screen1
	firstScreen.style.opacity = 0;

	//Make screen1 unclickable
	firstScreen.style.pointerEvents = "none";

	//Display screen 2 (opacity is 0 until setTimeout runs)
	secondScreen.style.display = "block";

	//Complete the screen switch
	setTimeout(function () {
		//Remove screen1
		firstScreen.style.display = "none";

		//Fade in screen2
		secondScreen.style.opacity = 1;

		//Make the main screen clickable immediately when switching to it.
		//The game screen will be clickable after the pattern is shown to the player.
		if (screen2 === 'main') {
			secondScreen.style.pointerEvents = "auto";
		} else {
			secondScreen.style.pointerEvents = "none";

			//Start up the game
			beginCountdown();
		}
	}, screenTransitionTime); //time must match css transition time
};
