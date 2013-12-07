function getRandomInt(low, high) {
	return parseInt(Math.random() * (high - low + 1) + low);
}

function generatePiece(id, diff) { //identifier is 1-10
	if (diff == 1) { //easy
		if (id <= 4) { //generate an operator
			if (id == 1) {
				return '+';
			} else if (id == 2) {
				return '-';
			} else if (id == 3) {
				return '*'
			} else if (id == 4) {
				return '/';
			}
		} else { //generate a piece
			return getRandomInt(1,9);
		}
	}
}
function generateBoard(params) {
	console.log('running');
	pieces = [];
	if (params.diff == 1) { //easy
		for (i = 0; i < 100; i++) {
			pieces.push(generatePiece(getRandomInt(1,10), 1));
		}
	}
	console.log(pieces);
}

function startGame() {
	if ($('#seed').val() !== '') {
		Math.seedrandom($('#seed').val());
		console.log(Math.random());
	}
	params = {diff: $('#diff').val()};
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