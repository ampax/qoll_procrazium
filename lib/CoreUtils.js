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

CoreUtils.translateToIndexedArray = function ( ar){
		if(!ar) return [];
		return ar.map(function (item,ix){ return {index : ix, value : item};});
};

CoreUtils.generateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

CoreUtils.encodeText = function(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
};

CoreUtils.encodeEmail = function(str) {
    return String(str).replace(/\./g,"&#46;")
};