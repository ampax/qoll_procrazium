var filename='client/lib/QollClientSide.js';


QollClientSide = {
	//TODO
	previewQollHtml : function(qolls) {
		// qlog.info('Printing preview qoll xxxx ============>' + JSON.stringify(qolls[0]), filename);
		var counter = 1;
		var html = '';
		qolls.map(function(qoll) {
			html += "<span class='qoll-container' id='"+qoll.qollId+"_outer"+"'>";
			html += "<div class='col-md-12 col-xs-12 list-group-item bg-qoll qoll-seperator qoll' id='"+qoll.qollId+"'>";
			html += "<span class='glyphicon glyphicon-remove red pull-right remove-qoll' id='"+qoll.qollId+"'></span>";


            // CREATE ROW FOR QOLL TITLE & PTS
            html += '<div class="row">';
                html += '<div class="col-xs-8">';
                if (qoll.qollTitle) {
                    html += '<h4>' + transform_tex(transform_fib(qoll.qollTitle, qoll.cat, qoll.context, qoll.fib), qoll.tex, qoll.texMode, counter) + '</h4>';
                } 
                html += '</div>';

                html += '<div class="col-xs-1"><h4>Pts:</h4></div>';
    
                html += '<div class="col-xs-2"><input class="form-control input-small wght" type="text" value="10"></div>';

                html += '<div class="col-xs-1">&nbsp;</div>';

            // END OF ROW
            html += '</div>';

			html += '<h5>' + transform_tex(transform_fib(qoll.qollText, qoll.cat, qoll.context, qoll.fib), qoll.tex, qoll.texMode, counter) + '</h5>';

			var types = qoll['types'];
			var ans;

			html += "</div>";
			var idx = 0;
			if (types.length > 1) {
				types.map(function(t) {
					if (t.isCorrect) {
						html += "<div class='col-md-12 col-xs-12 list-group-item'>";
						html += "<span class='badge pull-left qoll-response-val class_" + idx + " glossy'>" + alphabetical[idx] + "</span>";
						html += transform_tex(transform_fib(t.type, qoll.cat, qoll.context, qoll.fib), qoll.tex, qoll.texMode, counter);
						//html += "</div>";
						//html+= "<div class='col-md-2 col-xs-2 list-group-item'>";
						html += "<i class='glyphicon glyphicon-check pull-right green'></i>";
						html += "</div>";
						//html += "<div class='col-md-2 col-xs-2 list-group-item'>";
						//html += '<input class="form-control input-small" type="text">';
						//html += "</div>";
					} else {
						html += "<div class='col-md-12 col-xs-12 list-group-item'>";
						html += "<span class='badge pull-left qoll-response-val class_" + idx + " glossy'>" + alphabetical[idx] + "</span>";
						html += transform_tex(transform_fib(t.type, qoll.cat, qoll.context, qoll.fib), qoll.tex, qoll.texMode, counter);
						html += "</div>";
						//html += "<div class='col-md-2 col-xs-2 list-group-item'>";
						//html += '<input class="form-control input-small" type="text">';
						//html += "</div>";
					}

					idx = idx + 1;
				});
			}
			html += "</span>";
		});
		return html;
	},
};