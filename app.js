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

function drawPieces(dimensions) {
	for (i = 0; i < pieces.length; i++) {
		$('#board').append("<div class='row'>");
		for (j = 0; j < pieces[i].length; j++) {
			var currentPiece = pieces[i][j];
			if (currentPiece > 9) {
				if (currentPiece == 10) {
					currentPiece = '+';
				} else if (currentPiece == 11) {
					currentPiece = '-';
				} else if (currentPiece == 12) {
					currentPiece = '*';
				} else if (currentPiece == 13) {
					currentPiece = '/';
				}
			}
			console.log('cp: ' + currentPiece);
			$('#board').append("<div class='tile'>" + currentPiece + "</div>");
		}
		$('#board').append("</div>");
	}
	$('.tile').css('width', 100 / dimensions[0] + "%");
	setTimeout(function() {
		$('.tile').css('height', $('.tile').outerWidth() + "px");
	},1000);
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
	console.log(pieces);
	drawPieces(params.dimensions);
}

function startGame() {
	if ($('#seed').val() !== '') {
		Math.seedrandom($('#seed').val());
	}
	if ($('#diff').val() == 1) {
		var diffMax = 3;
	}
	var params = {diff: $('#diff').val(), diffMax: diffMax, dimensions: [7, 7]};
	$('#main-menu').hide("slow");
	$('#game').show("slow");
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

$('#board').on('click', '.tile', function() {
	$(this).addClass('selected');
});