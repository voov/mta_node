/**
 * SMTPParser class for node.js
 * Written by Daniel Fekete for VOOV Ltd.
 * Part of the MassMailer software tools
 * 2012(c) copyright VOOV Ltd.
 *
 * It uses a simple recursive descent parser (LL(1)) to parse the SMTP commands
 * Implements the RFC5321 with the possiblity of ESMTP extensions
 */


/**
 * getChar -> getNextToken -> (getChar until token is true) -> getTokenValue
 */

// enums in JavaScript is a pain in the ass
// define a set of tokens we use while parsing SMTP code
var TOKENS = {
	OPEN_ANGLE_BRACKET: '<',
	CLOSE_ANGLE_BRACKET: '>',
	AT_SIGN: '@',
	STRING: 1001,
	NUMBER: 1002,
	DBL_QUOTE: '"',
	COMMA: ','
};

// private lexer vars
var code_string = ""; // this will contain the whole SMTP command line
var code_string_pointer = 0; // since we cannot use pointers in JavaScript, we need to have a variable directly pointed at the code block
var current_token_value = ""; // contains the current token's value

// lexer functions

function isWhitespace(s) {
	if(!s) s = getChar();
	return s.match(/\s/);
}

// returns the current character in the code block
function getChar(skip_whitespace) {
	if(skip_whitespace) {
		if(isWhitespace()) {
			// if whitespace is found, then we should jump to the next char
			incrementPointer();
			getChar(skip_whitespace);
		}
	}
	return code_string[code_string_pointer];
}

function getKeyword(keyword) {
	for(var i in keyword) {
		if(getChar() != keyword[i]) return false;
	}
	return true;
}

// increment the character position in the global code block
function incrementPointer() {
	code_string_pointer++;
}

// looks ahead one character
function lookAhead(skip_whitespace, k) {
	var s = code_string[code_string_pointer+k];
	// if we need to skip the whitespace characters
	if(isWhitespace(s) && skip_whitespace) lookAhead(skip_whitespace, k+1);
	return s;
}

/**
 * parses an SMTP line
 * @param str
 */
exports.parseLine = function(str) {
	code_string = str;
};