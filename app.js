function getRandomInt(low, high) {
	return parseInt(Math.random() * (high - low + 1) + low);
}

function startGame() {
	console.log('wep');
	if ($('#seed').val() !== '') {
		Math.seedrandom($('#seed').val());
		console.log(Math.random());
	}
	$('#main-menu').hide()
}
$(document).ready(function() {
	var currentUnix = new Date().getTime();
	Math.seedrandom(currentUnix.toString());
	console.log('document ready');
});

$('#start-game').click(function () {
	startGame();
});