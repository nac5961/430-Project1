const screenTransitionTime = 1000; //milliseconds, must match CSS
const statusTransitionTime = 500; //milliseconds, must match CSS
let colorTransitionTime = 1000; //milliseconds, will be getting set in SetSpeed

//Function to change the transition speed based on the difficulty
const setSpeed = (speed) => {
	//Set transition time based on the speed
	colorTransitionTime = 1000 * speed; //in milliseconds
	
	//Update all colors
	document.getElementById('red').style.transition = `background-color ${speed}s`;
	document.getElementById('yellow').style.transition = `background-color ${speed}s`;
	document.getElementById('green').style.transition = `background-color ${speed}s`;
	document.getElementById('blue').style.transition = `background-color ${speed}s`;
};

//Function to countdown for the game to start
const beginCountdown = () => {
	//Get reference to the game status element
	const gameStatus = document.getElementById('game-status');
	
	const countDownTime = 4;
	let timer = 0;
	
	//Set text to beginning of countdown
	gameStatus.textContent = `Game starts in ${countDownTime} . . .`;
	
	for (let i = countDownTime - 1; i > 0; i--){
		//Space out the countdown display by one second to resemble an actual countdown
		timer += 1000; 
		
		//Complete the countdown
		setTimeout(() => { gameStatus.textContent = `Game starts in ${i} . . .`; }, timer);
	}
	
	//Add another second since we stopped at 1 in the loop
	timer += 1000; 
	
	//Play the game
	//Switch status and begin to show the pattern
	setTimeout(() => {
		//Switch status
		switchStatus('Watch Closely');
				
		//Display the pattern to match
		displayPattern();
			
	}, timer);
};

//Function to display the pattern that the player has to copy
const displayPattern = () => {
	let timer = 0;
	const interval = colorTransitionTime * 2; //double time to fade in and out before next color
	
	for (let i = 0; i < game.length; i++){
		//Space out displays
		timer += interval;
		
		//Fade the color in and out
		setTimeout(() => { fadeInAndOutColor(game[i]); }, timer);
	}
	
	//Add more time to allow the last color to finish
	timer += interval;
	
	//Finished the pattern - Get the player ready to start playing
	//Switch status and begin to show the pattern
	setTimeout(() => {
		//Switch status
		switchStatus("Copy the pattern");
				
		//Enable the game screen to let the player play
		enableGameScreen();
				
	}, timer);
};

//Function to fade the color in and out when showing the pattern
const fadeInAndOutColor = (color) => {
	//Get reference to the div associated with the color
	const colorDiv = document.getElementById(color.toLowerCase());
	
	//Fade in the color
	switch (color){
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
	setTimeout(() => { playSound(color); }, colorTransitionTime / 2);
	
	//Begin the process of fading out
	setTimeout(() => {
		//Fade out
		switch (color){
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
const checkChoice = (color) => {
	//Player is right - continue with the game
	if (game[0] === color){
		//play sound effect
		playSound(color);
		
		//Remove the item guessed correctly
		game.shift();
		
		//Player won - switch to win screen
		if (game.length === 0){
			//Mark that the game has ended
			gameOver = true;
			
			//Display win message
			switchStatus("You Won!!");
		}
	}
	
	//Player is wrong - switch to game over screen
	else{
		//play wrong sound effect
		playSound();
		
		//Mark that the game has ended
		gameOver = true;
		
		//Display game over message
		switchStatus("Game Over!!");
	}
};

//Function to make the game screen clickable after the pattern is shown
const enableGameScreen = () => {
	//Get reference to game screen
	const gameScreen = document.getElementById('game');
	
	//Enable clicking on the game screen
	gameScreen.style.pointerEvents = "auto";
};

//Function to switch the text that displays the status of the game
const switchStatus = (statusText) => {
	//Get reference to the game status element
	const gameStatus = document.getElementById('game-status');
	
	//Fade out the game status
	gameStatus.style.opacity = 0;
	
	//Complete the status switch
	setTimeout(() => {
		//Set the new text to display
		gameStatus.textContent = statusText;
		
		//Fade in the game status
		gameStatus.style.opacity = 1;
		
		//Exit the game once the game is over
		if (gameOver === true){
			setTimeout(() => { switchScreens('game', 'main'); }, 4000);
		}
		
	}, statusTransitionTime); //time must match css transition time
};

//Function to switch from one screen to the next
const switchScreens = (screen1, screen2) => {
	//Get the screens
	const firstScreen = document.getElementById(screen1);
	const secondScreen = document.getElementById(screen2);
		
	//Fade out screen1
	firstScreen.style.opacity = 0;
		
	//Make screen1 unclickable
	firstScreen.style.pointerEvents = "none";
		
	//Display screen 2 (opacity is 0 until setTimeout runs)
	secondScreen.style.display = "block";
		
	//Complete the screen switch
	setTimeout(() => {
		//Remove screen1
		firstScreen.style.display = "none";
			
		//Fade in screen2
		secondScreen.style.opacity = 1;
		
		//Make the main screen clickable immediately when switching to it.
		//The game screen will be clickable after the pattern is shown to the player.
		if (screen2 === 'main'){
			secondScreen.style.pointerEvents = "auto";
		}	
		else{
			secondScreen.style.pointerEvents = "none";
			
			//Start up the game
			beginCountdown();
		}
			
	}, screenTransitionTime); //time must match css transition time
};