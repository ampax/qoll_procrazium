var filename="lib/QollConstants.js";

QollConstants = {};

//Maximum number of qoll-types that are supported right now. This is how many colors are defined
QollConstants.MIN_SUPPORTED_QOLL_TYPES=9;
QollConstants.MAX_SUPPORTED_QOLL_TYPES=9;


//Supported qoll actions
QollConstants.QOLL = {};
QollConstants.QOLL_ACTION_SEND='send';
QollConstants.QOLL_ACTION_STORE='store';
QollConstants.QOLL_ACTION_ARCHIVE='archive';

//visibility will define whether everyone can see the qolls or only selected group of people
QollConstants.QOLL.VISIBILITY = {};
QollConstants.QOLL.VISIBILITY.PUB = 'public';
QollConstants.QOLL.VISIBILITY.PVT = 'private';
QollConstants.QOLL.VISIBILITY.DOM = 'domain';
QollConstants.QOLL.VISIBILITY.ORG = 'organization';

//difficulty will define difficulty level of the qolls
QollConstants.QOLL.DIFFICULTY = {};
QollConstants.QOLL.DIFFICULTY.EASY = 'Easy';
QollConstants.QOLL.DIFFICULTY.MIDIUM = 'Medium';
QollConstants.QOLL.DIFFICULTY.DIFFICULT = 'Difficult';

//type of the qoll will have to be supported by our editor
QollConstants.QOLL.TYPE = {};
QollConstants.QOLL.TYPE.SINGLE = 'Single';
QollConstants.QOLL.TYPE.MULTIPLE = 'Multiple';
QollConstants.QOLL.TYPE.BOOLEAN = 'Boolean';
QollConstants.QOLL.TYPE.FILL_BLANKS = 'Blank';
QollConstants.QOLL.TYPE.PEN = 'Pen';

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

//Qoll groups
QollConstants.GROUPS = {};
QollConstants.GROUPS.PUB = 'public';
QollConstants.GROUPS.PVT = 'private';
QollConstants.GROUPS.OPEN = 'open';
QollConstants.GROUPS.CLOSED = 'closed';
QollConstants.GROUPS.SM = 'small';
QollConstants.GROUPS.MD = 'medium';
QollConstants.GROUPS.LG = 'large';
QollConstants.GROUPS.INVITE = 'yes';
QollConstants.GROUPS.ROLE = {};
QollConstants.GROUPS.ROLE.ADMIN = 'admin';
QollConstants.GROUPS.ROLE.OWNER = 'owner';
QollConstants.GROUPS.ROLE.SUBSCRIBER = 'subscriber';