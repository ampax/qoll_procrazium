var filename='server/lib/QollKatexUtil.js';

QollKatexUtil = {

	populateIfTex : function (q, item) {
		if(item.tex && item.tex.length > 0) {
			//Process for tex
			q.qollTitle = KatexUtil.toHtml(q.qollTitle, item.tex);
			q.qollText = KatexUtil.toHtml(q.qollText, item.tex);
			q.hint = KatexUtil.toHtml(q.hint, item.tex);

			//qollTypes - map over and do the reverse-parsing here
            //qlog.info('Printing the qoll iiiiiiiiiiiid - ' + JSON.stringify(item), filename);
            //qlog.info('qollTypes ==============>' + item.qollTypes, filename);
			var qollTypesT = [];
			item.qollTypes.map(function(type){
				//qlog.info('==============>' + type['value'] + '/' + item._id, filename);
				type = KatexUtil.toHtml(type, item.tex);
				qollTypesT.push(type);
			});

            //qlog.info('qollTypesT ==============>' + qollTypesT, filename);
            q.qollTypes = CoreUtils.translateToIndexedArray(qollTypesT);

			/**_.each(q.qollTypes, function(type){
				qlog.info('==============>' + JSON.stringify(type) + '/' + type['value'] +'/' + item._id, filename);
				type = KatexUtil.toHtml(type['value'], item.tex);
				qlog.info('Printing type - ' + type, filename);
				qollTypesT.push(type);
			});
			q.qollTypes = qollTypesT;**/

			//qollTypesX - map over and do the reverse-parsing here
            //qlog.info('Printing the qoll iiiiiiiiiiiid - ' + JSON.stringify(q.qollTypesX), filename);
			q.qollTypesX.map(function(t){
				t.type = KatexUtil.toHtml(t.type, item.tex);
			});
            //qlog.info('Printing the qoll iiiiiiiiiiiid - ' + JSON.stringify(q.qollTypesX), filename);
		}

		return q;
	},
};


/**

var extractQollDetails = function(q) {
	return {
		qollTitle 		: q.title,
		qollText 		: q.qollText,
		qollTypes 		: translateToIndexedArray(q.qollTypes),
		qollTypesX 		: q.qollTypesX,

		cat 			: q.cat,
		answer 			: q.answer,
		fib 			: q.fib,
		hint 			: q.hint,
		unit_name 		: q.unit_name,
		unit 			: q.unit,
		visibility 		: q.visibility,
		complexity 		: q.complexity,
		//qollStarAttributes : q.qollStarAttributes ? q.qollStarAttributes : {},
		//qollAttributes 	: q.qollAttributes,
		submittedOn 	: q.submittedOn,
		submittedBy 	: q.submittedBy,
		submittedTo 	: q.submittedTo,
		action 			: q.action,
		enableEdit 		: q.action === 'store',
		stats 			: q.stats,
		viewContext 	: "createUsr",
		isMultiple		: q.isMultiple,
		_id 			: q._id,
		qollRawId 		: q.qollRawId
	};
};

{
    "action" : "store",
    "title" : "Consider the following quadratic equation - {TEX:0}",
    "qollText" : "If {TEX:1} represents a straight line, which of the following is a circle?",
    "cat" : "Multiple",
    "answer" : null,
    "fib" : [],
    "tex" : [ 
        "ax^2 + by^2 + cz^2 + 2d_1xy + 2d_2 yz + 2d_3 zx - 3d_4 xyz + d_4 = 0", 
        "ax + by + c = 0", 
        "ax^2 + by^2 = 0", 
        "a=0, b=0, c=0", 
        "a = 0, b=0, c=0, d_4 =0", 
        "a = 0, b=0, c=0, d_1=0, d_2=0, d_3=0, d_4 =0", 
        "d_i = 0, a = 0, d_4 = 16"
    ],
    "hint" : "{TEX:2} has radius = 0\n\n",
    "unit_name" : null,
    "unit" : null,
    "isMultiple" : true,
    "qollTypes" : [ 
        "&nbsp;{TEX:3}", 
        "&nbsp;{TEX:4}", 
        "&nbsp;{TEX:5}", 
        "&nbsp;{TEX:6}"
    ],
    "qollTypesX" : [ 
        {
            "index" : 0,
            "isCorrect" : 0,
            "type" : "&nbsp;{TEX:3}"
        }, 
        {
            "index" : 1,
            "isCorrect" : 0,
            "type" : "&nbsp;{TEX:4}"
        }, 
        {
            "index" : 2,
            "isCorrect" : 0,
            "type" : "&nbsp;{TEX:5}"
        }, 
        {
            "index" : 3,
            "isCorrect" : 0,
            "type" : "&nbsp;{TEX:6}"
        }
    ],
    "visibility" : "public",
    "complexity" : "Easy",
    "submittedOn" : ISODate("2014-10-03T02:42:20.979Z"),
    "submittedBy" : "AxeEsBDjCrsbZkKwT",
    "qollRawId" : "LRZDokbCPkNXKG32Y",
    "qollMasterId" : "WpmKk2PHLx9BFtFrc",
    "tags" : [ 
        "test"
    ],
    "qollFormat" : "html",
    "_id" : "J7sn3tQxDQN3SKtpQ"
}

**/