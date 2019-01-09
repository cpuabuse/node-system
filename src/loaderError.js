// loaderError.js
/*
	Provides errors to use during system loading.
*/
"use strict";

class LoaderError extends Error{
	constructor(code, message){
		super(message);
		this.code = code;
	}
}

exports.LoaderError = LoaderError;