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

function checkBoard(x1, y1, x2, y2) {

	var firstRow = "";

	for (var i = 0; i < pieces.length; i++) {
		if (pieces[y1][i] > 9) {
			firstRow += operatorIDIntoOperator(pieces[y1][i]);
		} else {
			firstRow += pieces[y1][i];
		}
	}

	var secondRow = "";

	for (var i = 0; i < pieces.length; i++) {
		if (pieces[y2][i] > 9) {
			secondRow += operatorIDIntoOperator(pieces[y2][i]);
		} else {
			secondRow += pieces[y2][i];
		}
	}

	console.log(firstRow);
	console.log(secondRow);

	for (var i = 3; i < params.dimensions[0]; i++) {
		for (var j = 0; j < params.dimensions[0] - i; j++) {
		}
	}
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

function operatorIDIntoString(id) {
	if (id == 10) {
		return '+';
	} else if (id == 11) {
		return '-';
	} else if (id == 12) {
		return '&times';
	} else if (id == 13) {
		return '&divide;';
	}
}
function operatorIDIntoOperator(id) {
	if (id == 10) {
		return '+';
	} else if (id == 11) {
		return '-';
	} else if (id == 12) {
		return '*';
	} else if (id == 13) {
		return '/';
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
				currentPiece = operatorIDIntoString(currentPiece);
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
			if ($('.selected')[1]) {
				return;
			}
			else if ($('.selected')[0]) {
				var xSelected = parseInt($('.selected').parent().attr('id').substr(4));
				var ySelected = parseInt($('.selected').attr('id'));

				var x = $(this).parent().attr('id').substr(4);
				var y = $(this).attr('id');

				if ((Math.abs(xSelected - x) == 0 || Math.abs(xSelected - x) == 1) && (Math.abs(ySelected - y) == 0 || Math.abs(ySelected - y) == 1)) { //wihin range
					$(this).addClass('psuedo-selected');
					$('.psuedo-selected').css('color', 'rgba(255, 255, 255, 0)');
					$('.selected').css('color', 'rgba(255, 255, 255, 0)');
					setTimeout(function() {
						var temp = $('.psuedo-selected').html();
						$('.psuedo-selected').html($('.selected').html());
						$('.selected').html(temp);
						temp = pieces[x][y];
						pieces[x][y] = pieces[xSelected][ySelected];
						pieces[xSelected][ySelected] = temp;
						$('.psuedo-selected').css('color', '#ecf0f1');
						$('.selected').css('color', '#ecf0f1');
						setTimeout(function() {
							$('.psuedo-selected').css('color', '#2c3e50');
							$('.selected').css('color', '#2c3e50');
							$('.selected').removeClass('selected');
							$('.psuedo-selected').removeClass('psuedo-selected');
							checkBoard(xSelected, ySelected, x, y);
						}, 500);
					},500);
				}
			} else {
				$(this).addClass('selected');
			}
		}
	});
});