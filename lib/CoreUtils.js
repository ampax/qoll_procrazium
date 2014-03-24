var filename='lib/CoreUtils.js';

/**********************************************/

		/*Global Util Functions for Qoll*/

/**********************************************/

CoreUtils = {};

//return a Uint8Array with all the values initialized to 0
CoreUtils.getUint8Array = function(size) {
	if(size == undefined)
		size = MAX_SUPPORTED_QOLL_TYPES;

	return Array.apply(null, Uint8Array(size)).map(function(){return 0});
}