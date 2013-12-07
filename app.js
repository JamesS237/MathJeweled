function getRandomInt(low, high) {
	return parseInt(Math.random() * (high - low + 1) + low);
}

function generatePiece(identifier) { //identifier is 1-10
	if (identifier <= 4) { //generate an operator

	} else {

	} //generate a piece
}
function generateBoard() {
	pieces = [];
	for (i = 0; i < 100; i++) {
		
	}
}

function startGame() {
	console.log('wep');
	if ($('#seed').val() !== '') {
		Math.seedrandom($('#seed').val());
		console.log(Math.random());
	}
	$('#main-menu').hide();
	params = {};
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