var filename='lib/HashUtil.js';


HashUtil = {
	checkHash : function(hash) {
		return hash && hash != null && Object.keys(hash).length > 0;
	},

	checkHash : function(hash, key) {
		return hash && hash != null && Object.keys(hash).length > 0 && hash[key] && hash[key] != null;
	},

	checkArray : function (arr) { 
		return arr && arr.length > 0;
	},
};