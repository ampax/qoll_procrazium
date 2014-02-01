var filename = "client/views/qoll/qolls.js";

var AllQolls = new Meteor.Collection("all-qolls");
//var QollDetails = new Meteor.Collection("qoll-details-by-id");
var QollRegist = new Meteor.Collection("qoll-regs");

Handlebars.registerHelper('include', function(options) {
    var context = {},
        mergeContext = function(obj) {
            for(var k in obj)context[k]=obj[k];
        };
    mergeContext(this);
    mergeContext(options.hash);
    return options.fn(context);
});


Handlebars.registerHelper('eachport', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }

        if (typeof (context[i]) == 'object') {
            context[i]['_iter_ix'] = i;
            ret = ret + fn(context[i], { data: data });
        } else { // make an object and add the index property
            item = {
                _iter_v: context[i], // TODO: make the name of the item configurable
                _iter_ix: i
            };
            ret = ret + fn(item, { data: data });
        }
       
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) {
            data.key = key;
            data.index = i;
             context[key]._iter_ix=i;
          }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

$.fn.outertxtonly = function( ) {
    var str = '';
	
    this.contents().each(function() {
        if (this.nodeType == 3) {
            str += this.textContent || this.innerText || '';
        }
    });

    return str;
};


//Meteor.autosubscribe(function () {

   QollRegist.find({}, {reactive:true}).observe({added:function(v){
   	 qlog.debug("Getting qoll regs ......", filename);   
 //alert("gotqoll reg");
   	var qollId = v.qollId;
   	var qollTypeVal = v.qollTypeVal;
   	$( '#'+qollId).siblings('.qoll-response-val').each(function(ix,elem){
   			var myouttxt = $.trim($(elem).find('.indent-littlebit').outertxtonly()) ;
   			qlog.info("a ......"+ myouttxt  +" *"+$.trim(qollTypeVal), filename);
    		if(myouttxt== $.trim(qollTypeVal)){
    			
    			$(elem).addClass('bg-orange');
    			
    		}else{
    			
    			$(elem).removeClass('bg-orange');
    		}
    	});
   } ,
   changed:function(v,vold){
   	 qlog.debug("Getting qoll regs ......", filename);   
 //alert("gotqoll reg");
   	var qollId = v.qollId;
   	var qollTypeVal = v.qollTypeVal;
   	//$( '#'+qollId).siblings('.qoll-response-val').addClass('bg-orange');/*each(function(elem){
      	$( '#'+qollId).siblings('.qoll-response-val').each(function(ix,elem){
   			var myouttxt = $.trim($(elem).find('.indent-littlebit').outertxtonly()) ;
   			qlog.info("a ......"+myouttxt  +" *"+$.trim(qollTypeVal), filename);
    		if(myouttxt== $.trim(qollTypeVal)){
    			
    			$(elem).addClass('bg-orange');
    			
    		}else{
    			
    			$(elem).removeClass('bg-orange');
    		}
    	});
   }
 });
//});


Template.qolls.helpers({
    allQolls: function(event){
        qlog.debug("Getting all the qolls ......", filename);                                                                                                                
        var q = AllQolls.find({}, {sort:{'submittedOn':-1}, reactive:true});
        qlog.info("Found qoll: " + JSON.stringify(q.fetch()), filename);
        return q;
    },
    value_at:function (obj,val){
		return obj?obj[val.replace(/\./g,"_")]:obj;
	},
	if_createusr: function (){
		return (this.viewContext =='createUsr');
	},
	if_stored: function (){
		return (this.action =='store');
	},
	if_send: function (){
		return (this.action =='send');
	},
	if_lock: function (){
		return (this.action =='lock');
	},
    iif: function(qollType){
        //qlog.info("Getting all the qollslkjhadkhaskf ......", filename);
        //qlog.info('iif(qollType):  ' + qollType, filename);
        if(qollType == 'yesno'){
            return Template['yesno']();
        }else if(qollType == 'yesnomaybe'){
            return Template['yesnomaybe']();
        }else{
            return Template['default']();
        }

        return Template['default']();
    },
    iif_yesno: function(qollType){
        //qlog.info('iif_yesno(qollType): ' + qollType, filename);
        if(qollType == 'yesno')
            return qollType;
    },
    iif_yesnomaybe: function(qollType){
        //qlog.info('iif_yesnomaybe(qollType): ' + qollType, filename);
        if(qollType == 'yesnomaybe')
            return qollType;
    },
    iif_likedislike: function(qollType){
        //qlog.info('iif_likedislike(qollType): ' + qollType, filename);
        if(qollType == 'likedislike')
            return qollType;
    },
    iif_likedislikeindiff: function(qollType){
        //qlog.info('iif_likedislikeindiff(qollType): ' + qollType, filename);
        if(qollType == 'likedislikeindiff')
            return qollType;
    },
    iif_default: function(qollType){
        //qlog.info('iif_default(qollType): ' + qollType, filename);
        if(qollType != 'yesno' && qollType != 'yesnomaybe' && qollType != 'likedislike' && qollType != 'likedislikeindiff')
            return 'default';
    },
    qoll_type_abbr: function(idx) {
        return alphabetical[idx];
    },
    qoll_abbr_class: function(idx) {
        return "class_"+idx;
    }
});


Template.qolls.events({
    /**'click': function(){
        qlog.info('Selected to qoll: ' + this._id + ', qollText: ' + qollText, filename);                                                                                     
        Session.set('selected_qoll_id', this._id);
        Session.set('qollId', this._id);
    },**/

    'click a.yes': function(event){
        event.preventDefault();
        if(Meteor.userId()){
            var qollId = this._id;//Session.get('selected_qoll_id');
            qlog.info('Registering qoll for: ' + qollId+'/yes', filename);                                                                                                    
	        Meteor.call('registerQoll', qollId, 'yes', function(err, qollRegId){
                qlog.info('Registered qoll with id: ' + qollRegId+'/yes', filename);
            });
            ReactiveDataSource.refresh('qollstat'+ qollId);
        }
    },
	'click .qoll-response-val': function(event){
		event.preventDefault();
        //jQuery(this).removeClass('orange');
        var chk=$(event.target);
        var foundorange=false;
        if(chk.hasClass('qoll-response-val')) {
          //  chk.siblings().removeClass('bg-orange');
          //  chk.addClass('bg-orange');
            foundorange=true;
        }
        if(!foundorange){
        chk=$(event.target).parent();
        if(chk.hasClass('qoll-response-val')) {
          //  chk.siblings().removeClass('bg-orange');
          //  chk.addClass('bg-orange');
        }
        foundorange=true;
        }
        if(!foundorange){
        chk=$(event.target).parent().parent();
        if(chk.hasClass('qoll-response-val')) {
         //   chk.siblings().removeClass('bg-orange');
         //   chk.addClass('bg-orange');
        }
        foundorange=true;
        }
		var qollId = this.parent._id;
		var qoll = this.parent;
		var answerIndex =0;//event.target.id;
		var answerVal = this._iter_v;
		
		qlog.info('youclicked: ' +this._iter_v, filename);   
		qlog.info('youclickedon: ' +event, filename);  
		qlog.info('youclickedid: ' +qollId, filename);
		qlog.info('the aindex ='+answerIndex,filename);
	    Meteor.call('registerQollCustom', qollId, answerVal,0, function(err, qollRegId){
            qlog.info('Registered qoll with id: ' + qollRegId+ answerVal, filename);
        });
		ReactiveDataSource.refresh('qollstat'+ qollId);

        $(event.target).closest("[class='qoll-response-val']").addClass('bg-orange');
		},
	'click .send-qoll-btn': function(event){
		event.preventDefault();
		var qollId = this._id;
		qlog.info('youclicked to send: ' +qollId, filename);  
		Meteor.call('modifyQollId', qollId, 'send', function(err, qollRegId){
                qlog.info('SENT qoll with id: ' + qollRegId+' err '+err, filename);
            });
	},
	'click .lock-qoll-btn': function(event){
		event.preventDefault();
		var qollId = this._id;
		qlog.info('youclicked to LOCK: ' +qollId, filename);  
		Meteor.call('modifyQollId', qollId,'lock', function(err, qollRegId){
                qlog.info('LOCKED qoll with id: ' + qollRegId+' err '+err, filename);
            });
	},
	'click .resend-qoll-btn': function(event){
		event.preventDefault();
		var qollId = this._id;
		var choice=confirm("Resend this qoll?");
		if(choice){
			//qlog.info('youclicked to archiveyes: ' +qollId, filename);
			Meteor.call('modifyQollId', qollId,'send', function(err, qollRegId){
                qlog.info('sent qoll with id: ' + qollRegId+' err '+err, filename);
            });			
		}else{
			//qlog.info('youclicked to no: ' +qollId, filename);
		}
	},	
	'click .archive-qoll-btn': function(event){
		event.preventDefault();
		var qollId = this._id;

		var choice=confirm("Archive this qoll?");
		if(choice){
			//qlog.info('youclicked to archiveyes: ' +qollId, filename);
			Meteor.call('modifyQollId', qollId,'archive', function(err, qollRegId){
                qlog.info('archived qoll with id: ' + qollRegId+' err '+err, filename);
            });			
		}else{
			//qlog.info('youclicked to no: ' +qollId, filename);
		}
		
	},
    'click a.no': function(event){
        event.preventDefault();
        if(Meteor.userId()){
            var qollId = this._id;
            qlog.info('Registering qoll for: ' + qollId+'/no', filename);                                                                                                     
            Meteor.call('registerQoll', qollId, 'no', function(err, qollRegId){
                qlog.info('Registered qoll with id: ' + qollRegId+'/no', filename);
            });
        }
    },

    'click a.maybe': function(event){
        event.preventDefault();
        if(Meteor.userId()){
            var qollId = this._id;
            qlog.info('Registering qoll for: ' + qollId+'/maybe' + event, filename);                                                                                                     
            Meteor.call('registerQoll', qollId, 'maybe', function(err, qollRegId){
                qlog.info('Registered qoll with id: ' + qollRegId+'/maybe', filename);
            });
        }
    },

    'click .render-chart-btn': function(event) {
        event.preventDefault();
        qlog.info('clicked to fetch stats for qoll with id: ' + this._id, filename);
        //var handle = QollStats.find(this._id);
        //chartStats();
        //qlog.info('Recieved qlog register data: ' + this._id + ', value: ' + $("div.charts").html(), filename);
        //$("#chart").highcharts(handle);
        //$("#charts").html(chartStats(this._id));
        var chart_id = "#charts"+this._id;
        var ctx = $(chart_id).get(0).getContext("2d");
        qlog.info("Clicked on chart: charts" + this._id, filename);

        qlog.info('******************Generating chart now at location: ' + chart_id, filename);
        var str = chartStats(this,ctx,"div.chartStats"+this._id);
        //LineChart(this._id, ctx);
        //PieChart(this._id, ctx);
        //DoughnutChart(this._id, ctx);
        return;
    }
});

Template.qolls.rendered = function(){
    qlog.info('Running post rendered code', filename);

    jQuery(".selector" ).tabs({ active: 1 });
    //jQuery(".selector" ).tabs({ "Primary", "active", 1 });


    $("i.lock-btn").hover(
       function () {
        $(this).toggleClass('red');
       }
     );

    $("i.lock-btn").click(function() {
        //$("#ccc").slideDown('fast').show();
        $(this).removeClass('orange').addClass('red');
    });

    //$('body').addClass('bg1');
    $('body').removeClass('bg1');
}
