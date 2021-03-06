//globals
var pieces;
var params;
var boardExists;
var target = 10;
var score = 0;
var moves = 0;

function simulateGravity() {
	zeroesRemaining = true;
	while (zeroesRemaining) {
		for (i = 0; i < pieces.length; i++) {
			for (j = 0; j < pieces[i].length; j++) {
				if (pieces[i][j] == 0) {
					try {
						pieces[i][j] = pieces[i - 1][j];
						pieces[i - 1][j] = 0;
						$('#row-' + (i - 1) + ' #' + j).html("0");
						piece = pieces[i][j];
						if (piece > 9) {
							piece = idIntoString(piece);
						}
						$('#row-' + i + ' #' + j).html(piece);
						if (i - 1 == 0) {
							zeroesRemaining = false;
						}
					}
					catch (Error) {
						zeroesRemaining = false;
					}
				}
			}
		}
	}
}

function removeSolution(coordinate, length, horizontal) {
	$('#score').html(score);
	target = getRandomInt(1, params.targetMax);
	$('#target').html(target);
	//coordinate 0 is row, coordinate 1 is column
	var newPiece;
	if (horizontal) {
		for (i = 0; i < length; i++) {
			$('#row-' + coordinate[0] + ' #' + (coordinate[1] + i)).addClass('selected');
			$('#row-' + coordinate[0] + ' #' + (coordinate[1] + i)).css('color', '#ecf0f1');
		}
		setTimeout(function() {
			for (i = 0; i < length; i++) {
				$('#row-' + coordinate[0] + ' #' + (coordinate[1] + i)).removeClass('selected');
				$('#row-' + coordinate[0] + ' #' + (coordinate[1] + i)).css('color', '#2c3e50');
				$('#row-' + coordinate[0] + ' #' + (coordinate[1] + i)).html('0');
				pieces[coordinate[0]][coordinate[1] + i] = 0;
			}
			simulateGravity();
			for (i = 0; i < length; i++) {
				newPiece = generatePiece(getRandomInt(1, params.diffMax));
				pieces[0][coordinate[1] + i] = newPiece;
				$('#row-0 #' + (coordinate[1] + i)).html(idIntoString(newPiece));
			}
		}, 500);
	} else {
		for (i = 0; i < length; i++) {
			$('#row-' + (coordinate[0] + i) + ' #' + coordinate[1]).addClass('selected');
			$('#row-' + coordinate[0] + ' #' + (coordinate[1] + i)).css('color', '#ecf0f1');
		}
		setTimeout(function() {
			for (i = 0; i < length; i++) {
				$('#row-' + (coordinate[0] + i) + ' #' + coordinate[1]).removeClass('selected');
				$('#row-' + coordinate[0] + ' #' + (coordinate[1] + i)).css('color', '#2c3e50');
				$('#row-' + (coordinate[0] + i) + ' #' + coordinate[1]).html('0');
				pieces[coordinate[0] + i][coordinate[1]] = 0;

			}
			simulateGravity(length);
			for (i = 0; i < length; i++) {
				newPiece = generatePiece(getRandomInt(1, params.diffMax));
				if (newPiece > 9) {
					newPiece = idIntoString(newPiece);
				}
				pieces[i][coordinate[1]] = newPiece;
				$('#row-' + i + ' #' + coordinate[1]).html(newPiece);
			}
		}, 500);
	}
}

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

	//check the rows...

	var firstRow = "";

	for (var i = 0; i < pieces.length; i++) {
		firstRow += idIntoOperator(pieces[x1][i]);
	}

	var secondRow = "";

	if (x1 != x2) {
		for (var i = 0; i < pieces.length; i++) {
			secondRow += idIntoOperator(pieces[x2][i]);
		}
	}
	console.log('############################');
	console.log(firstRow);
	console.log(secondRow);
	console.log('############################');

	var equation1;
	var equation2;

	for (var i = 0; i < pieces[0].length; i++) {
		for (var j = 3; j < pieces[0].length - i + 1; j++) {
			equation1 = firstRow.substr(i, j);
			try {
				if (eval(equation1) == target) {
					console.log('success');
					score += (equation1.length - 2) * 10;
					removeSolution([x1, i], j, true);
				}
				console.log(equation1 + ' - ' + eval(equation1));
			}
			catch (Error) {
				console.log('Error - ' + equation1);
			}
			if (x1 != x2) {
				equation2 = secondRow.substr(i, j);
				try {
					if (eval(equation2) == target) {
						console.log('success');
						score += (equation2.length - 2) * 10;
						removeSolution([x2, i], j, true);
					}
					console.log(equation2 + ' - ' + eval(equation2));
				}
				catch (Error) {
					console.log('Error - ' + equation2);
				}
			}
		}
	}

	console.log('-----------------------------------');

	var firstColumn = "";

	for (var i = 0; i < pieces.length; i++) {
		firstColumn += idIntoOperator(pieces[i][y1]);
	}

	var secondColumn = "";
	if (y1 != y2) {
		for (var i = 0; i < pieces.length; i++) {
			secondColumn += idIntoOperator(pieces[i][y2]);
		}
	}
	console.log('############################');
	console.log(firstColumn);
	console.log(secondColumn);
	console.log('############################');

	for (var i = 0; i < params.dimensions[1]; i++) {
		for (var j = 3; j < params.dimensions[1] - i + 1; j++) {
			equation1 = firstColumn.substr(i, j);
			try {
				if (eval(equation1) == target) {
					console.log('success');
					score += (equation1.length - 2) * 10;
					removeSolution([i, y1], j, false);
				}
				console.log(equation1 + ' - ' + eval(equation1));
			}
			catch (Error) {
				console.log('Error - ' + equation1);
			}
			if (x1 != x2) {
				equation2 = secondColumn.substr(i, j);
				try {
					if (eval(equation2) == target) {
						console.log('success');
						score += (equation2.length - 2) * 10;
						removeSolution([i, y2], j, false);
					}
					console.log(equation2 + ' - ' + eval(equation2));
				}
				catch (Error) {
					console.log('Error - ' + equation1);
				}
			}
		}
	}
	console.log('-----------------------------------');
}

function generatePiece(id, diff) { //identifier is 1-10
	if (id == 1) { //generate an operator
		return getRandomInt(10,params.operatorMax);
	} else { //generate a piece
		return getRandomInt(1,9);
	}
}

function idIntoString(id) {
	if (id < 10) {
		return "" + id;
	} else if (id == 10) {
		return '+';
	} else if (id == 11) {
		return '-';
	} else if (id == 12) {
		return '&times';
	} else if (id == 13) {
		return '&divide;';
	} else if (id == 14) {
		return '%';
	}
}
function idIntoOperator(id) {
	if (id < 10) {
		return "" + id;
	} else if (id == 10) {
		return '+';
	} else if (id == 11) {
		return '-';
	} else if (id == 12) {
		return '*';
	} else if (id == 13) {
		return '/';
	} else if (id == 14) {
		return '%';
	}
}

function drawPieces() {
	for (i = 0; i < pieces.length; i++) {
		$('#board').append("<div class='row' id='row-" + i + "'>");
		for (j = 0; j < pieces[i].length; j++) {
			var currentPiece = idIntoString(pieces[i][j]);
			$('#row-' + i).append("<div class='tile' id='" + j + "'>" + currentPiece + "</div>");
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
			pieces[i][j] = generatePiece(getRandomInt(1, params.diffMax));
		}
	}
	drawPieces();
}

function startGame() {
	if ($('#seed').val() !== '') {
		Math.seedrandom($('#seed').val());
	}
	if ($('#diff').val() == 1) {
		var diffMax = 3;
		var targetMax = 15;
		var operatorMax = 11;
	}
	else if ($('#diff').val() == 2) {
		var diffMax = 3;
		var targetMax = 30;
		var operatorMax = 13;
	}
	else if ($('#diff').val() == 3) {
		var diffMax = 4;
		var targetMax = 50;
		var operatorMax = 14;
	}
	params = {diff: $('#diff').val(), diffMax: diffMax, dimensions: [7, 7], targetMax: targetMax, operatorMax: operatorMax};
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
							moves += 1;
							$('#moves').html(moves);
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