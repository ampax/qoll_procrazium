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