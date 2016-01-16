var filename='client/views/q/sent/view_sent.js';

Template.view_sent.helpers({
  closed_on : function(closed_on) {
  		if(closed_on && closed_on.closed_on) {
			// return qollstionnaireSubmittedOn;
			return "<span class='red_1'>"+moment(closed_on.closed_on).format('MMM Do YYYY, h:mm a')+"</span>";
		}
	},
	page_label : function() {
		qlog.info( 'mcmcmcmcmcmcmcmcmcmcmcmcmc', filename );
		return "SENT";
	},
	qolls : function() {
		if(Session.get('selected-questionnaire-topics')) return ISentQuestionaire.find({topics : {$all : Session.get('selected-questionnaire-topics')}}); 
		else if(Session.get('questionnaire-search-box-text')) {
			qlog.info('xzzzzxzzzzzxzzzzzzxzzzzzx==================================> ' + Session.get('questionnaire-search-box-text'), filename);

			return QuestionnaireSearch.getData({
		      transform: function(matchText, regExp) {
		      	qlog.info('Match text -------> ' + matchText, filename);
		      	qlog.info('Reg exp -------> ' + regExp, filename);
		        return matchText.toString().replace(regExp, "<b>$&</b>")
		      },
		      sort: {isoScore: -1}
		    });
		}
		else return ISentQuestionaire.find({}); 
	}
});

Template.view_sent.events({
	'click #menu-toggle' : function(e,t) {
		e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        qlog.info('togggggggggggggled ......', filename);
	},
	'click .archive-qoll-btn' : function(event) {
		event.preventDefault();
		var questid = this._id;
		qlog.info('Clicked to archive this questionnaire ' + questid, filename);
		
		Meteor.call("removeQuestionnaire", questid, function(error, msg) {
			if (error) {
				QollError.message(QollConstants.MSG_TYPE.ERROR, 'ERROR: Error occured while remove the questionaire. Please try again or contact help.');
			} else {
				QollError.message(QollConstants.MSG_TYPE.SUCCESS, 'Success: Removed questionaire.');
			}
		});
	},
	'click .sendemail' : function(event) {
		//event.preventDefault();
		var questid = this._id;
		qlog.info('Clicked to resend email this questionnaire ' + questid, filename);
		// Will be sending the emails on the server side
		Meteor.call('sendQollstionnaireMail', questid, function(err, data) {
          if (err) {
            qlog.info('Failed sending the email - ' + questid + '/' + err, filename);
          } else {
            qlog.info('Sent the email - ' + questid + ', message - ' + data, filename);
          }
        });
	},
	// URLUtil.SITE_URL+'ext_email_board/'+user_q_uuid+'/'+id+'/'+email+'/email
	// http://localhost:5000/ext_email_board/5e0714a7-1d59-480f-9c77-372fc68ea4f8/F2pPoF6rzdR3ZFZLY/kaushik.anoop@gmail.com/embed
	// /ext_embed_board/:_id/:email_id/:qoll_portal
	'click .copy-link' : function(event) {
		//event.preventDefault();
		var questid = this._id;
		var embeddable_url = URLUtil.SITE_URL+'ext_embed_board/'+questid+'/user_emailid/embed';
		qlog.info('Clicked to copy link for this questionnaire ' + questid, filename);
		// alert(embeddable_url);
		prompt("Copy and embed the link", embeddable_url);
		//$(event.target).popover();
		// return embeddable_url;
	},
});



var fun_jq_tree_construct = function(fav_topics_tree, data, node_topics, id){
	_.keys(fav_topics_tree).forEach(function(el, idx, array){
		var jqtree_hash = {};
		var moving_favs_hash = fav_topics_tree[el];

		jqtree_hash['label'] = el + ' (' + moving_favs_hash['count'] + ')';
		jqtree_hash['id'] = id + 1;

		if(node_topics && node_topics.length == 0) jqtree_hash['topics'] = [];
		else {
			jqtree_hash['topics'] = node_topics.slice();;
		}
		jqtree_hash['topics'].push(el);


		console.log(el);
		console.log(moving_favs_hash);
		if(moving_favs_hash) {
			if(moving_favs_hash['count']) delete moving_favs_hash['count'];
			if(moving_favs_hash['label']) delete moving_favs_hash['label'];

			if(_.keys(moving_favs_hash).length > 0) {
				jqtree_hash['children'] = [];
				fun_jq_tree_construct(moving_favs_hash, jqtree_hash['children'], jqtree_hash['topics'], id + 1);
			}
		}

		//while(moving_favs_hash) {
			//
		//}

		data.push(jqtree_hash);
	});
};

Template.view_sent.rendered = function(){
	//set the background of the selected box.
	$('li#sent').css('background-color', 'firebrick');

	var fav_topics = QbTopics.findOne({});

	if(!fav_topics || !fav_topics.qollstionnaire) return;
	var fav_topics_tree = fav_topics.qollstionnaire.topic_tree;

	console.log(fav_topics);
	console.log(fav_topics_tree);

	var data_1 = [];
	var node_topics = [];
	fun_jq_tree_construct(fav_topics_tree, data_1, node_topics, 1);

	var data = [{
		label : 'Contents (' + fav_topics.qollstionnaire.topic_count + ')',
		id 	  : 1,
		children : data_1
	}];


	console.log(data);

	$('#tree1').tree({
        data: data,
        //saveState: true,
        // closedIcon: 'i class="fa fa-arrow-circle-right"',
    	// openedIcon: '&lt;i class="fa fa-arrow-circle-down"&gt;&lt;/i&gt;'
    });

    $('#tree1').bind(
	    'tree.click',
	    function(event) {
	        // The clicked node is 'event.node'
	        var node = event.node;

	        //console.log(node);
	        //console.log(node.topics);
	        Session.set('selected-questionnaire-topics', node.topics);
	        Session.set('questionnaire-search-box-text', undefined);

	        var theURL = node.url;
	        if (theURL) {
	            // location.href = theURL;
	        }
	    }
	);
};