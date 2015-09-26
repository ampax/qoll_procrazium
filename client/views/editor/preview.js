Template.preview.helpers({
  preview_content: function() {
    var data = preview_data.get("preview_data");
    var qolls = [];
    var tqolls = [];
    qlog.info('======================================================================================' +data, filename);

    if(data) {
      qolls = ReactiveMethod.call('parse_downtown', data, DownTownOptions.downtown_default());

      tqolls = ReactiveMethod.call('parseQollPreview', data);
      console.log(tqolls);
    }

    console.log('============================================================================');
    // console.log(qolls);

    return tqolls;
  },
  qoll_type_abbr : function(idx) {
    return alphabetical[idx];
  },
  transform_txt : function(txt, cat, context, fib, tex) {
    var txt_1 = transform_fib(txt, cat, context, fib);

    var txt_2 = transform_tex(txt_1, tex);

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
  qlog.info('Printing fill in the blanks - ' + fib, filename);
    if(cat != QollConstants.QOLL_TYPE.BLANK)
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

transform_tex = function(txt, tex) {
  qlog.info('Printing tex - ' + tex, filename);

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
            html = katex.renderToString(tex_val);

            txt = txt.replace(matches[0], html);
            //cntr++;
            //qlog.info('##############=> ' + idx, filename);
            //break;
        }

    return txt;
};
