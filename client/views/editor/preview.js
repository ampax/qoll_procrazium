var filename="client/views/editor/preview.js";

previewCollection = new Meteor.Collection(null);

Template.preview.helpers({
  preview_content: function() {
    var data = preview_data.get("preview_data");
    var tex_pref = preview_data.get("tex_pref");
    var qoll_focus_attrib = preview_data.get("qoll_focus_attrib");

    var g_count = qoll_focus_attrib ? qoll_focus_attrib.g_count : 0;;
    var p_count = qoll_focus_attrib ? qoll_focus_attrib.p_count : 0;
    var focus_qoll = qoll_focus_attrib ? qoll_focus_attrib.f_qoll : undefined;
    
    var qolls = [];
    var tqolls = [];
    var prevColl = previewCollection.find({}).fetch();
    //qlog.info('======================================================================================' +focus_qoll, filename);
    //qlog.info('======================================================================================' +tex_pref, filename);
    //qlog.info('======================================================================================' +prevColl.length, filename);

    if( prevColl.length > g_count ) {
      // qoll has been removed from the editor, let us reset the local mongo session
      previewCollection.remove({});
    }

    var idx = !prevColl ? prevColl.length : 1;
    if(data && prevColl.length === 0) { // that means this is some preview data loaded init call has been made
      qlog.info('======================================================================================>');
      // parse all the qolls and insert these in the local collection
      tqolls = ReactiveMethod.call('parseQollPreview', data, tex_pref);
      // console.log(tqolls);
      tqolls && tqolls.map(function(tqoll){
        // tqoll['idx'] = idx;
        previewCollection.insert(tqoll);
        // idx = idx + 1;
      });

    } else if(prevColl.length > 0 && focus_qoll != undefined) {
      qlog.info('+_+_+_+_+_+=>' + p_count + '/' +focus_qoll, filename);
      var oldd = previewCollection.find({'idx' : p_count}).fetch()[0]; //.fetch()[0]
      var noww = ReactiveMethod.call('parseQollPreview', "# "+focus_qoll, tex_pref);

      noww && noww.map(function(nw){
        nw['idx'] = p_count;
        //console.log(nw);
        previewCollection.update({ 'idx' : p_count }, {$set : nw});
        //previewCollection.remove({'idx' : p_count});
        //previewCollection.insert(nw);
        //console.log('XXXXXXXXXXXXXX');
      });

      //console.log('============================================================================');
      //console.log(oldd);
      //console.log(noww);
      //console.log('============================================================================');
    }

    return previewCollection.find({}, {$sort : {idx : 1}});
  },
  qoll_type_abbr : function(idx) {
    return alphabetical[idx];
  },
  transform_txt : function(txt, cat, context, fib, tex, tex_mode, qoll_idx) {
    var txt_1 = transform_fib(txt, cat, context, fib);

    var txt_2 = transform_tex(txt_1, tex, tex_mode, qoll_idx);

    // txt_2 = txt_2 + "\\({a1x^3+z=0}\\)";

    return txt_2;
  },
  get_units_html : function(q) {
    var unit_name = undefined, units = undefined;
    qlog.info('Printing unit values - ' + unit_name, + ' **/** ' + units, filename);
    console.log(q);
    if (units == undefined || units && units.length === 0)
      return '';

    var qollTypeVal = this.qollTypeVal;
    var unitSelected = qollTypeVal ? qollTypeVal.unitSelected : '';

    var units_html = '<div class="input-group">';
    if (unit_name)
      units_html += unit_name + ': ';
    else
      unit_name += 'Unit: ';
    units.map(function(unit) {
      var checked = '';
      if (unit === unitSelected)
        checked = 'checked';
      units_html += '<input name="unit" value="' + unit + '" type="radio" ' + checked + '>' + unit + '&nbsp;&nbsp;';
    });
    units_html += '</div>';

    return units_html;
  },
  imgs: function(img_ids) {
      console.log(img_ids);
      if(!img_ids) return [];
      var imgs1 = QollImages.find({'_id': {$in: img_ids}});
      return imgs1;
  },
  is_blank_type : function(cat) {
    return _.contains([QollConstants.QOLL_TYPE.BLANK, QollConstants.QOLL_TYPE.BLANK_DBL], cat);
  },
  get_register_class : function(context) {
    console.log(context);
    if(context === QollConstants.CONTEXT.READ) {
      return 'register-blank-none';
    } else return 'register-blank';
  },
  get_register_bg_class : function(context) {
    console.log(context);
    if(context === QollConstants.CONTEXT.READ) {
      return 'white_bg_5';
    } else return 'green_bg_1';
  },
  is_correct_answer : function(qollTypesX, idx, context) {
    if(context === QollConstants.CONTEXT.WRITE) return false;

    if (qollTypesX == undefined)
      return false;

    if (qollTypesX.isCorrect) {
      return true;
    }
    
    return false;
  },
});

Template.preview.onCreated(function(){
    this.subscribe('images');
});



transform_fib = function(txt, cat, context, fib) {
  // qlog.info('Printing fill in the blanks - ' + fib, filename);
    if(cat != QollConstants.QOLL_TYPE.BLANK || !fib)
      return txt;

    var disabled = '';
    if(context === QollConstants.CONTEXT.READ)
      disabled = 'DISABLED';

    if(txt.match(QollRegEx.fib_transf))
      qlog.info('hell this is printed', filename);

    while (matches = QollRegEx.fib_transf.exec(txt)) {
      //qlog.info('matches - ' + matches, filename);
      var idx = matches[0].substring(1, matches[0].length-1);
      idx = Number(idx)+1;

            var placeholder = '';
            var fib_val = '';
            if(context === QollConstants.CONTEXT.READ) {
              //put the read only values for fib
              placeholder = idx + ':' + fib[idx-1];
            } else {
              if(fib == undefined)
                fib_val = '';
              else fib_val = fib[idx-1] == undefined ? '' : fib[idx-1];
              placeholder ='';
            }
            
            txt = txt.replace(matches[0], '<input class="textbox fib fib_write" type="text" placeholder="'+placeholder+ '" ' +disabled+' value="'+fib_val+'">');
            //cntr++;
            //qlog.info('##############=> ' + idx, filename);
            //break;
        }

    return txt;
};

transform_tex = function(txt, tex, tex_mode, qoll_idx) {
  // qlog.info('Printing tex - ' + tex, filename);

    if(!tex) return txt;

    if(txt.match(QollRegEx.tex_transf))
      qlog.info('hell-tex this is printed: ' + txt, filename);

    while (matches = QollRegEx.tex_transf.exec(txt)) {
      //qlog.info('matches - ' + matches, filename);
      console.log(matches);
      console.log(matches[0]);

      var idx = matches[0].substring(5, matches[0].length-1);
      qlog.info('Index is ---------> ' +  idx, filename);

      idx = Number(idx)+1;

            var placeholder = '';
            var tex_val = '';
            if(tex == undefined)
              tex_val = '';
            else tex_val = tex[idx-1] == undefined ? '' : tex[idx-1];

            qlog.info('Text is ---------> ' + tex[idx-1]  + '/' + idx, filename);
            
            // var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}");
            var html = '';
            if(tex_mode === QollConstants.TEX_MODE.KATEX) {
              html = katex.renderToString(tex_val);
            } else {
              // html = "\\({"+"a1x^3+z=0"+"}\\)";
              html = "<span id='"+qoll_idx+"."+idx+"'>\\({"+tex_val+"}\\)</span>";
            }

            txt = txt.replace(matches[0], html);
            //cntr++;
            //qlog.info('##############=> ' + idx, filename);
            //break;
        }

    return txt;
};
