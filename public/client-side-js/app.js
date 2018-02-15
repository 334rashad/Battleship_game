console.log("app.js is connected");

const game = {
	boardSize: 7,
	numShips: 4,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""]},
		{ locations: [0, 0, 0], hits: ["", "", ""]},
		{ locations: [0, 0, 0], hits: ["", "", ""]},
		{ locations: [0, 0, 0], hits: ["", "", ""]}
	],

	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess);

			if(ship.hits[index] === "hit") {
				view.displayMessage("You have already hit this location");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("Hit!");

				if(this.isSunk(ship)) {
					view.displayMessage("You sank one battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed!");
		return false;
	},

	isSunk: function(ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if(ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},

	generateShipLocationByUser: function() {
		for (let i = 0; i < this.ships.length; i++) {
			let location, row, col, point;
			do {
				try {
				point = prompt(`Please enter a point on the battle table: Letter, then number, for the ship ${i}`);
				point = parseGuess(point);
				row = parseInt(point.charAt(0));
				col = parseInt(point.charAt(1));
			} catch(e){};
				while(isNaN(row) && isNaN(col)){
					try{
					point = prompt(`Please enter a point on the battle table: Letter, then number, for the ship ${i}`);
					point = parseGuess(point);
					row = parseInt(point.charAt(0));
					col = parseInt(point.charAt(1));
				}catch(e){};
				}

				let direction = prompt(`Please enter "H" for horizontal direction and "V" for vertical for the ship ${i}`);
				if(direction.toUpperCase() === "H") {
					direction = 0;
				} else {
					direction = 1;
				}

				let shipLocation = function (direc) {
					let newShipLocations = [];
					for (let i = 0; i < game.shipLength; i++) {
						if (direc === 1) {
							newShipLocations.push(row + "" + (col + i));
						} else {
							newShipLocations.push((row + i) + "" + col);
						}
					}
					return newShipLocations;
				}

				location = shipLocation(direction)
			} while (game.collision(location));
			game.ships[i].locations = location;
		}
			console.log("Ships array: ");
			console.log(game.ships);
		
	},

	generateShipLocation: function() {
		let location;

		for (let i = 0; i < this.numShips; i++) {
			do {
				location = this.generateShip();
			} while (this.collision(location));
			this.ships[i].locations = location;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		let direction = Math.floor(Math.random()*2);
		let row, col;

		if(direction === 1) {
			row = Math.floor(Math.random()*this.boardSize);
			col = Math.floor(Math.random()*(this.boardSize - this.shipLength + 1));
		} else {
			col = Math.floor(Math.random()*this.boardSize);
			row = Math.floor(Math.random()*(this.boardSize - this.shipLength + 1));
		}

		let newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (let i = 0; i < this.numShips; i++) {
			const ship = this.ships[i];
			for (let j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
}; /*game*/

var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageForUser");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
		// cell.innerHTML = "HIT";

	},

	displayMiss: function(location) {
		try {
			var cell = document.getElementById(location);
			cell.setAttribute("class", "miss");
			// cell.innerHTML = "MISS";
		} catch (e) {
			console.error(e.message);
		}
	},
};

const controller = {
	guesses: 0,

	processGuess: function(guess) {
		let location = parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = game.fire(location);
			if (hit && game.shipsSunk === game.numShips) {
				view.displayMessage("You won! Total number of attacks: "+
					this.guesses);
			}
		}
	}
};

function parseGuess(guess) {
	let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if(guess === null || guess.length !== 2) {
		alert("Please enter a valid point: a letter and a number");
	} else {
		guess = guess.toUpperCase();
		const firstChar = guess.charAt(0);
		const row = alphabet.indexOf(firstChar);
		const column = guess.charAt(1);

		if(isNaN(row) || isNaN(column)) {
			alert("Not a valid input");
		} else if (row < 0 || row >= game.boardSize || column < 0 || column >= game.boardSize) {
			alert("No such point on a board");
		} else {
			return row +""+ column;
		}
	}
	return null;
};

function handleFireButton() {
	let guessInput = document.getElementById("userInput");
	let guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
	// document.getElementById("fireButton").addEventListener("click", function(){
	// 	var guess = document.getElementById("userInput").value.toUpperCase();
	// 	controller.processGuess(guess);
	// 	document.getElementById("userInput").value = "";
	// });
};

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	e=e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
};

function init() {
	game.generateShipLocationByUser();

	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	var guessInput = document.getElementById("userInput");
	guessInput.onkeypress = handleKeyPress;

	document.getElementById("battleTable").addEventListener("click", fireTorpedo, false);


	function fireTorpedo(e) {
	    // if item clicked (e.target) is not the parent element on which the event listener was set (e.currentTarget)
		if (e.target.tagName = "td") {
	        // extract row and column # from the HTML element's id
			var row = e.target.id;
			let hit = game.fire(row);
			if (hit && game.shipsSunk === game.numShips) {
				view.displayMessage("You won! Total number of attacks: "+
					this.guesses);
			}
	  }
	    e.stopPropagation();
	}
};

window.onload = init;
