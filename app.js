//globals
var pieces;
var params;
var boardExists;

function getRandomInt(low, high) {
	return parseInt(Math.random() * (high - low + 1) + low);
}

function getTileDimensions() {
	return $('.tile').outerWidth();
}

function sizePieces() {
	$('.tile').css('width', 100 / params.dimensions[0] + "%");
	setTimeout(function() {
		$('.tile').css('height', getTileDimensions() + "px");
		$('.tile').css('line-height', getTileDimensions() + "px");
		$('.tile').css('font-size', getTileDimensions() * 0.75 + "px");
	}, 1000);
}

function checkBoard() {

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

function drawPieces() {
	for (i = 0; i < pieces.length; i++) {
		$('#board').append("<div class='row' id='row-" + i + "'>");
		for (j = 0; j < pieces[i].length; j++) {
			var currentPiece = pieces[i][j];
			var operator = '';
			if (currentPiece > 9) {
				operator = 'operator';
				if (currentPiece == 10) {
					currentPiece = '+';
				} else if (currentPiece == 11) {
					currentPiece = '-';
				} else if (currentPiece == 12) {
					currentPiece = '&times';
				} else if (currentPiece == 13) {
					currentPiece = '&divide;';
				}
			}
			$('#row-' + i).append("<div class='tile " + operator + "' id='" + j + "'>" + currentPiece + "</div>");
		}
		sizePieces();
	}
}
function generateBoard() {
	$('#main').css('width', '70%');
	$('#main').css('padding', '4%');
	boardExists = true;
	console.log('running');
	pieces = [];
	for (i = 0; i < params.dimensions[1]; i++) {
		pieces[i] = []
		for (j = 0; j < params.dimensions[0]; j++) {
			pieces[i][j] = generatePiece(getRandomInt(1, params.diffMax), params.diff);
		}
	}
	console.log(pieces);
	drawPieces();
}

function startGame() {
	if ($('#seed').val() !== '') {
		Math.seedrandom($('#seed').val());
	}
	if ($('#diff').val() == 1) {
		var diffMax = 3;
	}
	params = {diff: $('#diff').val(), diffMax: diffMax, dimensions: [7, 7]};
	$('#main-menu').hide("slow");
	$('#game').show("slow");
	generateBoard(params);
}

$(window).resize(function() {
	if (boardExists) {
		sizePieces();
	}

});

$(document).ready(function() {
	var currentUnix = new Date().getTime();
	Math.seedrandom(currentUnix.toString());
	console.log('document ready');

	$('#start-game').click(function () {
		startGame();
	});

	$('#board').on('click', '.tile', function() {
		if ($(this).hasClass('selected')) {
			$(this).removeClass('selected');
		} else {
			if ($('.selected')[0]) {
				var xSelected = parseInt($('.selected').parent().attr('id').substr(4));
				var ySelected = parseInt($('.selected').attr('id'));

				var x = $(this).parent().attr('id').substr(4);
				var y = $(this).attr('id');

				if ((Math.abs(xSelected - x) == 0 || Math.abs(xSelected - x) == 1) && (Math.abs(ySelected - y) == 0 || Math.abs(ySelected - y) == 1)) { //wihin range
					var temp = $(this).html();
					$(this).html($('.selected').html());
					$('.selected').html(temp);
					$('.selected').removeClass('selected');
				}
			} else {
				$(this).addClass('selected');
			}
		}
	});
});