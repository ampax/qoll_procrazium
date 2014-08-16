var filename='client/lib/QollClientSide.js';

QollClientSide = {
	//TODO
	previewQollHtml : function(qolls) {
		qlog.info('Printing preview qoll xxxx ============>' + qolls[0], filename);
		var html = '';
		qolls.map(function(qoll) {
			html += "<span class='qoll-container' id='"+qoll.qollId+"_outer"+"'>";
			html += "<div class='col-md-12 col-xs-12 list-group-item bg-qoll qoll-seperator qoll' id='"+qoll.qollId+"'>";
			html += "<span class='glyphicon glyphicon-remove red pull-right remove-qoll' id='"+qoll.qollId+"'></span>";


			if (qoll.qoll_star_attributes && qoll.qoll_star_attributes[QollConstants.EDU.TITLE]) {
				html += '<h4>' + qoll.qoll_star_attributes[QollConstants.EDU.TITLE] + '</h4>';
			} else if(qoll.title) {
				html += '<h4>' + qoll.title + '</h4>';
			}

			html += '<h5>' + qoll['qoll'] + '</h5>';

			var types = qoll['types'];
			var ans;

			html += "</div>";
			var idx = 0;
			if (types.length > 1) {
				types.map(function(t) {
					if (t.isCorrect) {
						html += "<div class='col-md-12 col-xs-12 list-group-item'>";
						html += "<span class='badge pull-left qoll-response-val class_" + idx + " glossy'>" + alphabetical[idx] + "</span>";
						html += t.type;
						//html += "</div>";
						//html+= "<div class='col-md-2 col-xs-2 list-group-item'>";
						html += "<i class='glyphicon glyphicon-check pull-right green'></i>";
						html += "</div>";
					} else {
						html += "<div class='col-md-12 col-xs-12 list-group-item'>";
						html += "<span class='badge pull-left qoll-response-val class_" + idx + " glossy'>" + alphabetical[idx] + "</span>";
						html += t.type;
						html += "</div>";
					}

					idx = idx + 1;
				});
			}
			html += "</span>";
		});
		return html;
	},
};