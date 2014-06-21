var filename="lib/QollConstants.js";

QollConstants = {};

//Maximum number of qoll-types that are supported right now. This is how many colors are defined
QollConstants.MIN_SUPPORTED_QOLL_TYPES=9;
QollConstants.MAX_SUPPORTED_QOLL_TYPES=9;


//Supported qoll actions
QollConstants.QOLL_ACTION_SEND='send';
QollConstants.QOLL_ACTION_STORE='store';
QollConstants.QOLL_ACTION_ARCHIVE='archive';

//Qoll editor modes
QollConstants.EDITOR_MODE ={};
QollConstants.EDITOR_MODE.BASIC ='basic';
QollConstants.EDITOR_MODE.ADV='advanced';


//Qoll preference keys
QollConstants.PREF_KEY = {};
QollConstants.PREF_KEY.EDITOR_MODE='editor_mode';

//Qoll statuses
QollConstants.STATUS = {};
QollConstants.STATUS.ACTIVE='active';
QollConstants.STATUS.NOT_ACTIVE='not-active';



//Qoll Editor Education QollConstants
QollConstants.EDU = {};
QollConstants.EDU.TITLE='title';
QollConstants.EDU.HINT='hint';
QollConstants.EDU.UNITS='unit';
QollConstants.EDU.UNIT_NAME='unit_name';
QollConstants.EDU.ALLOWED_STARS=['title', 'hint', 'hints','unit', 'units']; //Allowed extra qoll editor educational contants, start with *