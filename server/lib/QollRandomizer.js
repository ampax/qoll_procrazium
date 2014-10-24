var filename='server/lib/QollRandomizer.js';

var RAND_SEED = [10, 10, 10];

QollRandomizer = {
	
	seed : function () {
		return Math.floor(Math.random() * 3) + 1; /* 1,2,3 */
	},

	rand : function () {
		return RAND_SEED[QollRandomizer.seed() - 1];
	},

	randomize : function (q) {
		// rand_top is already populated in the qoll. Do all subsequent rands and derands on top of it
		if(q.rand_top == undefined) { //rand_top = 100
			q.rand_top = QollRandomizer.rand();
		}

		//Start the randomization now
		var randIdx = []; //[0, 1, 2, 3, 4, 5]
		var sigma_idx = 0; //summing all the indexes, this is sum(0,5) = 0+1+2+3+4+5 = 15
		q.qollTypes.map(function(type, idx){
			randIdx.push(idx);
			sigma_idx = sigma_idx + idx;
		});

		sigma_idx = [7, 17, 31, 13, 23];

		var rand_hash_1 = {}; //{ 0 : 50, 1: 35, 2: 20, 3: 5, 4: 10, 5: 25, 50 : 0, 35 : 1, 20 : 2, 5 : 3, 10 : 4, 25 : 5}
		var rand_hash_2 = {};
		randIdx.map(function(idx){
			rand_hash_1[idx] = Math.abs(idx * sigma_idx - q.rand_top); // idx to value hash

			var x = Math.abs(idx * sigma_idx[0] - q.rand_top);
			x = Math.abs(x * sigma_idx[1] - q.rand_top);
			x = Math.abs(x * sigma_idx[2] - q.rand_top);
			x = Math.abs(x * sigma_idx[3] - q.rand_top);
			x = Math.abs(x * sigma_idx[4] - q.rand_top);
			//rand_hash_2[Math.abs(idx * sigma_idx - q.rand_top)] = idx; // value to idx hash
			rand_hash_2[Math.abs(x)] = idx; // value to idx hash
		});

		var seededIdx = _.values(rand_hash_1); //[50, 35, 20, 5, 10, 25, 5, 4, 3, 2, 1, 0]
		seededIdx.sort(); //[5, 10, 20, 25, 35, 50]

		//Now we have our random order
		var qollTypesRand = [];
		var randCnt;
		/**seededIdx.map(function(sidx){
			//Find the index of the values here
			randCnt = rand_hash[sidx]; // 5 -> 3 (D), 10 -> 4(E), 20 -> 2(C), 25 -> 5(F), 35 -> 1(B), 50 -> 0(A)

			//If you notice here, the order of qolls is randomized
			//D is pushed at index 0(A), E is pushed at 1(B), C at 2(C), F at 3(D), B at 4(E), A at 5(F)
			qollTypesRand.push(q.qollTypes[randCnt]);
		});**/

		Object.keys(rand_hash_2).forEach(function (key) { 
		    var value = rand_hash_2[key];
		    qollTypesRand.push(q.qollTypes[value]);
		    // iteration code
		})

		q.qollTypesRand = qollTypesRand;
		//q.qollTypesRand = rand_hash_1;
		q.rand_hash_1 = rand_hash_1;
		q.rand_hash_2 = rand_hash_2;

		return q;
	},

	derandomize : function () {
		//TODO
	},

};


