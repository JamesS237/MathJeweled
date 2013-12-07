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
	for (i = 0; i < params.dimensions[1]; i++) {
		pieces[i] = []
		for (j = 0; j < params.dimensions[0]; j++) {
			pieces[i][j] = generatePiece(getRandomInt(1, params.diffMax), params.diff);
		}
	}
	var text;
	for (i = 0; i < pieces.length; i++) {
		for (j = 0; j < pieces[i].length; j++) {
			$('#board').append("<div class='tile'>" + pieces[i][j] + "</div>");
		}
	}
	console.log(pieces);
}

function startGame() {
	if ($('#seed').val() !== '') {
		Math.seedrandom($('#seed').val());
	}
	var params = {diff: $('#diff').val(), dimensions: [10, 10]};
	$('#main-menu').hide("slow");
	$('#game').show("slow");0
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