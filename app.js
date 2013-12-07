//globals
var pieces;

function getRandomInt(low, high) {
	return parseInt(Math.random() * (high - low + 1) + low);
}

function generatePiece(id, diff) { //identifier is 1-10
	if (diff == 1) { //easy
		if (id == 1) { //generate an operator
			return getRandomInt(10,13);
		} else { //generate a piece
			return getRandomInt(1,9);
		}

		//1-9 are their respective numbers
		// 10 is plus, 11 is minus, 12 is multiply, 13 is divide
	}
}

function generateBoard(params) {
	console.log('running');
	pieces = [];
	if (params.diff == 1) { //easy
		if (params.dimensions !== undefined) {
			boardArea = params.dimensions[0] * params.dimensions[1];
			console.log(boardArea);
		} else {
			boardArea = 100;
		}
		for (i = 0; i < boardArea; i++) {
			pieces.push(generatePiece(getRandomInt(1,3), 1));
		}
	}
	console.log(pieces);
}

function startGame() {
	if ($('#seed').val() !== '') {
		Math.seedrandom($('#seed').val());
	}
	var params = {diff: $('#diff').val(), dimensions: [10, 10]};
	$('#main *').hide()
	generateBoard(params);
}
$(document).ready(function() {
	var currentUnix = new Date().getTime();
	Math.seedrandom(currentUnix.toString());
	console.log('document ready');
});

$('#start-game').click(function () {
	startGame();
});