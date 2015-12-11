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
                if (qoll.qollTitle && qoll.qollTitle != '') {
                    html += '<h4>' + transform_tex(transform_fib(qoll.qollTitle, qoll.cat, qoll.context, qoll.fib), qoll.tex, qoll.texMode, counter) + '</h4>';
                } else {
                	html += '<h4>Add some qoll title here</h4>';
                }
                html += '</div>';

                html += '<div class="col-xs-1"><h4>Pts:</h4></div>';
    
                html += '<div class="col-xs-2"><input class="form-control input-small wght" type="text" value="10"></div>';

                html += '<div class="col-xs-1">&nbsp;</div>';

            // END OF ROW
            html += '</div>';

            if(qoll.qollText && qoll.qollText != ''){
				html += '<h5>' + transform_tex(transform_fib(qoll.qollText, qoll.cat, qoll.context, qoll.fib), qoll.tex, qoll.texMode, counter) + '</h5>';
			} else {
				html += '<h5>Add some text here ...</h5>';
			}

			//html += '<button type="button" class="btn btn-warning pull-right" data-toggle="tooltip"';
            //html += '	data-placement="left" title="Partial credit will be deducted..." id="show_hint">Hint';
          	//html += '</button>';
          	//html += '<div class="red_1" id="hint">'
          	if(qoll.hint && qoll.hint != 'null' && qoll.hint != '')
            	html += '<div class="col-xs-10"><h5 class="red_1">HINT: '+ qoll.hint +'</h5></div>  <div class="col-xs-2"> <input class="form-control input-small hint_penalty" style="width:34px;" type="text" value="-30">%</div>';
          	//html += '</div>';
        
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