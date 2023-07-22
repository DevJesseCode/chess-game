"use strict";

const game_board = document.querySelector(".chessboard");
const entries_element = document.querySelector("#entries");
const message_element = document.querySelector(".message");
const binding = [0, "a", "b", "c", "d", "e", "f", "g", "h"];
const playing_squares = [];
const pieces = [];
const verify = {
	king(target, move_to) {
		const targetSquare = target.parentElement;
		const moveSquare = move_to;

		// Calculate the absolute differences in rows and columns
		const rowDiff = Math.abs(targetSquare.id[1] - moveSquare.id[1]);
		const colDiff = Math.abs(binding.indexOf(targetSquare.id[0]) - binding.indexOf(moveSquare.id[0]));

		// Check if the move is valid for a king (within a single square)
		if (rowDiff <= 1 && colDiff <= 1) {
			// Check if will kill own piece
			if (
				moveSquare.firstElementChild &&
				moveSquare.firstElementChild.id.includes(target.id.includes("white") ? "white" : "black")
			) {
				// Will kill own piece
				return false;
			}
			// The move is valid for a king
			return true;
		} else {
			// The move is not valid for a king
			return false;
		}
	},
	queen(target, move_to) {
		const targetSquare = target.parentElement;
		const moveSquare = move_to;

		// Check if the move is along a row, column, or diagonal
		if (
			targetSquare.id[1] === moveSquare.id[1] ||
			targetSquare.id[0] === moveSquare.id[0] ||
			Math.abs(targetSquare.id[1] - moveSquare.id[1]) ===
				Math.abs(binding.indexOf(targetSquare.id[0]) - binding.indexOf(moveSquare.id[0]))
		) {
			// Determine the direction of movement
			const rowIncrement =
				targetSquare.id[1] === moveSquare.id[1]
					? 0
					: toNumber(targetSquare.id[1]) < toNumber(moveSquare.id[1])
					? 1
					: -1;
			const colIncrement =
				targetSquare.id[0] === moveSquare.id[0]
					? 0
					: binding.indexOf(targetSquare.id[0]) < binding.indexOf(moveSquare.id[0])
					? 1
					: -1;

			let currentRow = parseInt(targetSquare.id[1]) + rowIncrement;
			let currentCol = parseInt(binding.indexOf(targetSquare.id[0])) + colIncrement;

			while (
				currentRow !== parseInt(moveSquare.id[1]) ||
				currentCol !== parseInt(binding.indexOf(moveSquare.id[0]))
			) {
				const currentSquare = document.querySelector(`#${binding[currentCol]}${currentRow}`);

				// Check if there is a piece in the current square
				if (currentSquare.childElementCount === 1) {
					// There is a piece in the way
					return false;
				}

				currentRow += rowIncrement;
				currentCol += colIncrement;
			}

			if (
				move_to.firstElementChild &&
				move_to.firstElementChild.id.includes(target.id.includes("white") ? "white" : "black")
			) {
				// Will kill own piece
				return false;
			}
			// The move is valid (no piece in the way)
			return true;
		} else {
			// The move is not along a row, column, or diagonal
			return false;
		}
	},
	rook(target, move_to) {
		const targetSquare = target.parentElement;
		const moveSquare = move_to;

		// Check if the move is along a row or column
		if (targetSquare.id[1] === moveSquare.id[1] || targetSquare.id[0] === moveSquare.id[0]) {
			// Determine the direction of movement
			const rowIncrement =
				targetSquare.id[1] === moveSquare.id[1]
					? 0
					: toNumber(targetSquare.id[1]) < toNumber(moveSquare.id[1])
					? 1
					: -1;
			const colIncrement =
				targetSquare.id[0] === moveSquare.id[0]
					? 0
					: binding.indexOf(targetSquare.id[0]) < binding.indexOf(moveSquare.id[0])
					? 1
					: -1;

			let currentRow = parseInt(targetSquare.id[1]) + rowIncrement;
			let currentCol = parseInt(binding.indexOf(targetSquare.id[0])) + colIncrement;

			while (
				currentRow !== parseInt(moveSquare.id[1]) ||
				currentCol !== parseInt(binding.indexOf(moveSquare.id[0]))
			) {
				const currentSquare = document.querySelector(`#${binding[currentCol]}${currentRow}`);

				// Check if there is a piece in the current square
				if (currentSquare.childElementCount === 1) {
					// There is a piece in the way
					return false;
				}

				currentRow += rowIncrement;
				currentCol += colIncrement;
			}

			// Check if will kill own piece
			if (
				moveSquare.firstElementChild &&
				moveSquare.firstElementChild.id.includes(target.id.includes("white") ? "white" : "black")
			) {
				// Element child of moveSquare is own piece
				return false;
			}

			// The move is valid (there is no piece in the way)
			return true;
		} else {
			// The move is not along a row or column
			return false;
		}
	},
	knight(target, move_to) {
		const targetSquare = target.parentElement;
		const moveSquare = move_to;

		// Calculate the absolute differences in rows and columns
		const rowDiff = Math.abs(targetSquare.id[1] - moveSquare.id[1]);
		const colDiff = Math.abs(binding.indexOf(targetSquare.id[0]) - binding.indexOf(moveSquare.id[0]));

		// Check if the move is valid for a knight
		if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
			// Check if will kill own piece
			if (
				moveSquare.firstElementChild &&
				moveSquare.firstElementChild.id.includes(target.id.includes("white") ? "white" : "black")
			) {
				// Element child of moveSquare is own piece
				return false;
			}

			// The move is valid for a knight
			return true;
		} else {
			// The move is not valid for a knight
			return false;
		}
	},
	bishop(target, move_to) {
		const targetSquare = target.parentElement;
		const moveSquare = move_to;

		// Calculate the row and column differences between the squares
		const rowDiff = moveSquare.id[1] - targetSquare.id[1];
		const colDiff = binding.indexOf(moveSquare.id[0]) - binding.indexOf(targetSquare.id[0]);

		// Validate the move
		if (Math.abs(rowDiff) === Math.abs(colDiff)) {
			// The move is along a diagonal

			const rowIncrement = rowDiff > 0 ? 1 : -1; // Determine the row increment direction
			const colIncrement = colDiff > 0 ? 1 : -1; // Determine the column increment direction

			let currentRow = parseInt(targetSquare.id[1]) + rowIncrement;
			let currentCol = parseInt(binding.indexOf(targetSquare.id[0])) + colIncrement;

			while (
				currentRow !== parseInt(moveSquare.id[1]) &&
				currentCol !== parseInt(binding.indexOf(moveSquare.id[0]))
			) {
				const currentSquare = document.querySelector(`#${binding[currentCol]}${currentRow}`);

				// Check if there is a piece in the current square
				if (currentSquare.childElementCount === 1) {
					// There is a piece in the way
					return false;
				}

				currentRow += rowIncrement;
				currentCol += colIncrement;
			}

			// Check if will kill own piece
			if (
				moveSquare.firstElementChild &&
				moveSquare.firstElementChild.id.includes(target.id.includes("white") ? "white" : "black")
			) {
				// Element child of moveSquare is own piece
				return false;
			}

			// The move is valid (no piece in the way)
			return true;
		} else {
			// The move is not along a diagonal
			return false;
		}
	},
	pawn(target, move_to) {
		const targetSquare = target.parentElement;
		const moveSquare = move_to;

		// Calculate the row and column differences between the squares
		const rowDiff = moveSquare.id[1] - targetSquare.id[1];
		const colDiff = binding.indexOf(moveSquare.id[0]) - binding.indexOf(targetSquare.id[0]);

		// Validate the move
		if (target.id.includes("black")) {
			// Black pawn
			if (
				rowDiff === -1 && // Move one row forward
				colDiff === 0 // Stay in the same column
			) {
				// Valid move for a black pawn
				return true;
			} else if (
				rowDiff === -2 && // Move two rows forward
				colDiff === 0 && // Stay in the same column
				targetSquare.id[1] === "7" // Only on the initial two-square move
			) {
				// Valid move for a black pawn (initial two-square move)
				return true;
			} else if (
				rowDiff === -1 && // Move one row forward
				colDiff === 1 && // Move diagonally (right)
				moveSquare.childElementCount === 1 && // Capture an opponent's piece
				!moveSquare.firstElementChild.id.includes("black") // Opponent's piece is white
			) {
				// Valid move for a white pawn (capture diagonally right)
				return true;
			} else if (
				rowDiff === -1 && // Move one row forward
				colDiff === -1 && // Move diagonally (left)
				moveSquare.childElementCount === 1 && // Capture an opponent's piece
				!moveSquare.firstElementChild.id.includes("black") // Opponent's piece is white
			) {
				// Valid move for a white pawn (capture diagonally left)
				return true;
			} else if (
				rowDiff === -1 && // Move one row forward
				colDiff === -1 && // Move diagonally (left)
				moveSquare.childElementCount === 0 && // En passant capture
				targetSquare.id[1] === "4" && // Only on the correct row for en passant
				targetSquare.previousElementSibling.childElementCount === 1 && // Opponent's pawn
				!targetSquare.previousElementSibling.firstElementChild.id.includes("black") // Opponent's pawn is white
			) {
				// Valid move for a black pawn (en passant capture)
				targetSquare.previousElementSibling.removeChild(targetSquare.previousElementSibling.firstElementChild);
				return true;
			} else if (
				rowDiff === -1 && // Move one row forward
				colDiff === 1 && // Move diagonally (right)
				moveSquare.childElementCount === 0 && // En passant capture
				targetSquare.id[1] === "4" && // Only on the correct row for en passant
				targetSquare.nextElementSibling.childElementCount === 1 && // Opponent's pawn
				!targetSquare.nextElementSibling.firstElementChild.id.includes("black") // Opponent's pawn is white
			) {
				// Valid move for a black pawn (en passant capture)
				targetSquare.nextElementSibling.removeChild(targetSquare.nextElementSibling.firstElementChild);
				return true;
			} else {
				// Invalid move for a black pawn
				return false;
			}
		} else {
			// White pawn
			if (
				rowDiff === 1 && // Move one row forward
				colDiff === 0 // Stay in the same column
			) {
				// Valid move for a white pawn
				return true;
			} else if (
				rowDiff === 2 && // Move two rows forward
				colDiff === 0 && // Stay in the same column
				targetSquare.id[1] === "2" // Only on the initial two-square move
			) {
				// Valid move for a white pawn (initial two-square move)
				return true;
			} else if (
				rowDiff === 1 && // Move one row forward
				colDiff === 1 && // Move diagonally (right)
				moveSquare.childElementCount === 1 && // Capture an opponent's piece
				moveSquare.firstElementChild.id.includes("black") // Opponent's piece is black
			) {
				// Valid move for a white pawn (capture diagonally right)
				return true;
			} else if (
				rowDiff === 1 && // Move one row forward
				colDiff === -1 && // Move diagonally (left)
				moveSquare.childElementCount === 1 && // Capture an opponent's piece
				moveSquare.firstElementChild.id.includes("black") // Opponent's piece is black
			) {
				// Valid move for a white pawn (capture diagonally left)
				return true;
			} else if (
				rowDiff === 1 && // Move one row forward
				colDiff === 1 && // Move diagonally (left)
				moveSquare.childElementCount === 0 && // En passant capture
				targetSquare.id[1] === "5" && // Only on the correct row for en passant
				targetSquare.nextElementSibling.childElementCount === 1 && // Opponent's pawn
				targetSquare.nextElementSibling.firstElementChild.id.includes("black") // Opponent's pawn is black
			) {
				// Valid move for a black pawn (en passant capture)
				targetSquare.nextElementSibling.removeChild(targetSquare.nextElementSibling.firstElementChild);
				return true;
			} else if (
				rowDiff === 1 && // Move one row forward
				colDiff === -1 && // Move diagonally (left)
				moveSquare.childElementCount === 0 && // En passant capture
				targetSquare.id[1] === "5" && // Only on the correct row for en passant
				targetSquare.previousElementSibling.childElementCount === 1 && // Opponent's pawn
				targetSquare.previousElementSibling.firstElementChild.id.includes("black") // Opponent's pawn is black
			) {
				// Valid move for a black pawn (en passant capture)
				targetSquare.previousElementSibling.removeChild(targetSquare.previousElementSibling.firstElementChild);
				return true;
			} else {
				// Invalid move for a white pawn
				return false;
			}
		}
	},
};
const create_chessboard = () => {
	for (let i = 1; i <= 81; i++) {
		let square = document.createElement("div");
		square.classList.add("square");
		game_board.appendChild(square);
		square.classList.add("hidden");
		setTimeout(() => {
			square.classList.remove("hidden");
			if (i === 81) {
				create_history_entry("Finished initializing chess board");
			}
		}, toNumber(`${i * 75}`));

		if (i / 2 === Math.trunc(i / 2)) {
			square.classList.add("white");
		} else {
			square.classList.add("gray");
		}

		if (i <= 9) {
			square.classList.add("position-top");
		}
		if (i === 9) {
			square.classList.add("position-top");
			square.classList.add("position-right");
		}
		switch (i) {
			case 18:
				square.classList.add("position-right");
				break;
			case 27:
				square.classList.add("position-right");
				break;
			case 36:
				square.classList.add("position-right");
				break;
			case 45:
				square.classList.add("position-right");
				break;
			case 54:
				square.classList.add("position-right");
				break;
			case 63:
				square.classList.add("position-right");
				break;
			case 72:
				square.classList.add("position-right");
				break;
			case 81:
				square.classList.add("position-right");
				break;
			default:
				break;
		}
	}
};
const setup_history = () => {
	document.querySelector(".history").style.width = `${
		document.body.clientWidth - document.querySelector(".play-area").clientWidth - 40
	}px`;
	document.querySelector(".history").style.height = `${document.querySelector(".play-area").clientHeight - 20}px`;
	document.querySelector(".message_container").style.display = "flex";
	document.querySelector(".message_container").style.left = `
	${document.body.clientWidth / 2 - document.querySelector(".message_container").clientWidth / 2}px
	`;
	document.querySelector(".message_container").style.display = "none";
	set_entries_padding();
};
const mark_positions = () => {
	let squares_top = document.querySelectorAll(".position-top");
	let squares_right = document.querySelectorAll(".position-right");
	let bindings = ["a", "b", "c", "d", "e", "f", "g", "h"];
	for (let i = 0; i < 8; i++) {
		{
			let text_element = document.createElement("p");
			text_element.textContent = bindings[i];
			squares_top[i].appendChild(text_element);
		}
		{
			let text_element = document.createElement("p");
			text_element.textContent = 8 - i;
			squares_right[i + 1].appendChild(text_element);
		}
	}
};
const init_playing_squares = () => {
	for (let i = 0; i < document.querySelectorAll(".square").length; i++) {
		if (
			!(
				(i >= 0 && i <= 8) ||
				i === 17 ||
				i === 26 ||
				i === 35 ||
				i === 44 ||
				i === 53 ||
				i === 62 ||
				i === 71 ||
				i === 80
			)
		) {
			document.querySelectorAll(".square")[i].addEventListener("dragenter", (e) => {
				// console.log(e.target);
				lastDraggedTo = e.target;
			});
			playing_squares.push(document.querySelectorAll(".square")[i]);
		}
	}
};
const create_black_pieces = () => {
	for (let i = 0; i < 8; i++) {
		const piece = document.createElement("p");
		switch (i) {
			case 0:
				piece.setAttribute("id", `black-rook-1`);
				piece.textContent = "♜";
				break;
			case 1:
				piece.setAttribute("id", `black-knight-1`);
				piece.textContent = "♞";
				break;
			case 2:
				piece.setAttribute("id", `black-bishop-1`);
				piece.textContent = "♝";
				break;
			case 3:
				piece.setAttribute("id", `black-queen`);
				piece.textContent = "♛";
				break;
			case 4:
				piece.setAttribute("id", `black-king`);
				piece.textContent = "♚";
				break;
			case 5:
				piece.setAttribute("id", `black-bishop-2`);
				piece.textContent = "♝";
				break;
			case 6:
				piece.setAttribute("id", `black-knight-2`);
				piece.textContent = "♞";
				break;
			case 7:
				piece.setAttribute("id", `black-rook-2`);
				piece.textContent = "♜";
				break;
			default:
				alert(`We ran into an error while creating the black generals. (i === ${i})`);
		}
		piece.setAttribute("draggable", "true");
		pieces.push(piece);
		piece.classList.add("hidden");
		playing_squares[i].appendChild(piece);
		setTimeout(() => {
			piece.classList.remove("hidden");
		}, toNumber((i + 1) * 75));
	}
	for (let i = 8; i < 16; i++) {
		let pawn = document.createElement("p");
		pawn.setAttribute("id", `black-pawn-${i - 7}`);
		pawn.setAttribute("draggable", "true");
		pawn.textContent = "♟";
		pieces.push(pawn);
		pawn.classList.add("hidden");
		playing_squares[i].appendChild(pawn);
		setTimeout(() => {
			pawn.classList.remove("hidden");
		}, toNumber((i - 7) * 75));
	}
};
const create_white_pieces = () => {
	for (let i = 56; i < 64; i++) {
		const piece = document.createElement("p");
		switch (i) {
			case 56:
				piece.setAttribute("id", `white-rook-1`);
				piece.textContent = "♖";
				break;
			case 57:
				piece.setAttribute("id", `white-knight-1`);
				piece.textContent = "♘";
				break;
			case 58:
				piece.setAttribute("id", `white-bishop-1`);
				piece.textContent = "♗";
				break;
			case 59:
				piece.setAttribute("id", `white-queen`);
				piece.textContent = "♕";
				break;
			case 60:
				piece.setAttribute("id", `white-king`);
				piece.textContent = "♔";
				break;
			case 61:
				piece.setAttribute("id", `white-bishop-2`);
				piece.textContent = "♗";
				break;
			case 62:
				piece.setAttribute("id", `white-knight-2`);
				piece.textContent = "♘";
				break;
			case 63:
				piece.setAttribute("id", `white-rook-2`);
				piece.textContent = "♖";
				break;
			default:
				alert(`We ran into an error while creating the white generals. (i === ${i})`);
		}
		piece.setAttribute("draggable", "true");
		pieces.push(piece);
		piece.classList.add("hidden");
		playing_squares[i].appendChild(piece);
		setTimeout(() => {
			piece.classList.remove("hidden");
		}, toNumber((i - 55) * 75));
	}
	for (let i = 48; i < 56; i++) {
		let pawn = document.createElement("p");
		pawn.setAttribute("id", `white-pawn-${i - 47}`);
		pawn.setAttribute("draggable", "true");
		pawn.textContent = "♙";
		pieces.push(pawn);
		pawn.classList.add("hidden");
		playing_squares[i].appendChild(pawn);
		setTimeout(() => {
			pawn.classList.remove("hidden");
		}, toNumber((i - 47) * 75));
	}
};
const set_position_ids = () => {
	const ids = [];
	for (let i = 8; i >= 1; i--) {
		for (let element of ["a", "b", "c", "d", "e", "f", "g", "h"]) {
			ids.push(element + i);
		}
	}
	for (let i = 0; i < playing_squares.length; i++) {
		playing_squares[i].setAttribute("id", ids[i]);
	}
};
const create_history_entry = (entryContent) => {
	const entry = document.createElement("div");
	const entry_time = document.createElement("span");
	const entry_body = document.createElement("span");
	entry.classList.add("entry");
	entry_time.textContent = getTime();
	entry_body.textContent = entryContent;
	entry.appendChild(entry_time);
	entry.appendChild(entry_body);
	entries_element.appendChild(entry);
};
const set_entries_padding = () => {
	const history_width = document.querySelector(".history").style.width;
	const padding = `${toNumber(history_width) * 0.05}px`;
	entries_element.style.padding = `0px ${padding}`;
};
const getTime = () => {
	const date = new Date();
	const time_string = date.toTimeString();
	const time = time_string.split(" ")[0];
	return time;
};
const move_piece = (event) => {
	const target = event.target;
	const move_to = lastDraggedTo.nodeName === "#text" ? lastDraggedTo.parentElement : lastDraggedTo;
	const move_to_parent = move_to.tagName === "DIV" ? move_to : move_to.parentElement;
	const from = target.parentElement;
	let is_valid;
	// console.log(target);
	if (target.id.includes("rook")) {
		is_valid = verify.rook(target, move_to_parent);
		// console.log(is_valid);
	}
	if (target.id.includes("knight")) {
		is_valid = verify.knight(target, move_to_parent);
		// console.log(is_valid);
	}
	if (target.id.includes("bishop")) {
		is_valid = verify.bishop(target, move_to_parent);
		// console.log(is_valid);
	}
	if (target.id.includes("king")) {
		is_valid = verify.king(target, move_to_parent);
		// console.log(is_valid);
	}
	if (target.id.includes("queen")) {
		is_valid = verify.queen(target, move_to_parent);
		// console.log(is_valid);
	}
	if (target.id.includes("pawn")) {
		is_valid = verify.pawn(target, move_to_parent);
		// console.log(is_valid);
	}
	if (is_valid) {
		target.parentElement.removeChild(target);
		if (move_to.tagName === "DIV") {
			move_to.appendChild(target);
		} else {
			move_to_parent.removeChild(move_to);
			move_to_parent.appendChild(target);
		}
		change_active();
		create_history_entry(
			`${target.id.includes("white") ? "White" : "Black"} moved ${target.id.slice(
				6,
				target.id.lastIndexOf("-") > 6 ? target.id.lastIndexOf("-") : undefined
			)}: ${from.id} to ${move_to_parent.id}`
		);
		if (is_king_in_check()) {
			switch (is_king_in_check()) {
				case "white":
					create_history_entry(`White king is in check`);
					break;
				case "black":
					create_history_entry(`Black king is in check`);
					break;
				default:
					break;
			}
		}
	} else {
		showMessage(target.parentElement.id, move_to_parent.id);
	}
};
const showMessage = (from, to) => {
	const message_container = document.querySelector(".message_container");
	const overlay = document.querySelector(".overlay");
	overlay.style.display = "block";
	message_container.style.display = "flex";
	message_container.classList.add("slide_in_out");
	message_element.textContent = `Invalid move: ${document
		.querySelector(`#${from}`)
		.firstElementChild.id.slice(
			6,
			document.querySelector(`#${from}`).firstElementChild.id.lastIndexOf("-") > 6
				? document.querySelector(`#${from}`).firstElementChild.id.lastIndexOf("-")
				: undefined
		)
		.toUpperCase()} ${from} - ${to}`;
	setTimeout(() => {
		overlay.style.display = "none";
		message_container.style.display = "none";
		message_container.classList.remove("slide_in_out");
		message_element.textContent = ``;
	}, 1700);
};
const change_active = () => {
	if (active === "white") {
		for (let i = 16; i < 32; i++) {
			pieces[i].setAttribute("draggable", "false");
		}
		for (let i = 0; i < 16; i++) {
			pieces[i].setAttribute("draggable", "true");
		}
		active = "black";
	} else {
		for (let i = 0; i < 16; i++) {
			pieces[i].setAttribute("draggable", "false");
		}
		for (let i = 16; i < 32; i++) {
			pieces[i].setAttribute("draggable", "true");
		}
		active = "white";
	}
};
const is_king_in_check = () => {
	// Get the positions of the kings
	const white_king = document.querySelector("#white-king").parentElement;
	const black_king = document.querySelector("#black-king").parentElement;

	// Check if the white king is in check
	if (is_square_under_attack(white_king, "black")) {
		return "white";
	}

	// Check if the black king is in check
	if (is_square_under_attack(black_king, "white")) {
		return "black";
	}

	// No king is in check
	return false;
};
const is_square_under_attack = (square, attacker_color) => {
	// Loop through all pieces
	for (const piece of pieces) {
		const piece_color = piece.id.includes("white") ? "white" : "black";
		if (piece_color === attacker_color) {
			// Check if the attacker's piece can attack the square
			try {
				if (can_piece_attack_square(piece, square)) {
					return true;
				}
			} catch (e) {
				console.log(e, piece);
			}
		}
	}

	return false;
};
const can_piece_attack_square = (piece, square) => {
	// Get the target piece and the square to check
	const target_piece = piece; //.parentElement
	const target_square = square;

	// Determine the piece type
	const piece_type = piece.id.split("-")[1];
	console.log(piece_type);

	// Check if the piece can attack the square based on its type
	switch (piece_type) {
		case "king":
			return verify.king(target_piece, target_square);
		case "queen":
			return verify.queen(target_piece, target_square);
		case "rook":
			return verify.rook(target_piece, target_square);
		case "knight":
			return verify.knight(target_piece, target_square);
		case "bishop":
			return verify.bishop(target_piece, target_square);
		case "pawn":
			return verify.pawn(target_piece, target_square);
		default:
			return false;
	}
};

let active = "white";
let lastDraggedTo;

create_chessboard();
setup_history();
mark_positions();
init_playing_squares();
create_black_pieces();
create_white_pieces();
set_position_ids();

for (let element of playing_squares) {
	element.classList.add("playing-square");
}
for (let element of pieces) {
	element.addEventListener("dragend", (e) => move_piece(e));
}
for (let i = 0; i < 16; i++) {
	pieces[i].setAttribute("draggable", "false");
}

window.addEventListener("resize", setup_history);
create_history_entry("Script parsing complete");

/*
♔ U+2654 &#9812; &#x2654;
♕ U+2655 &#9813; &#x2655;
♖ U+2656 &#9814; &#x2656;
♗ U+2657 &#9815; &#x2657;
♘ U+2658 &#9816; &#x2658;
♙ U+2659 &#9817; &#x2659;
♚ U+265A &#9818; &#x265A;
♛ U+265B &#9819; &#x265B;
♜ U+265C &#9820; &#x265C;
♝ U+265D &#9821; &#x265D;
♞ U+265E &#9822; &#x265E;
♟ U+265F &#9823; &#x265F;
*/
