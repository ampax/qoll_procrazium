var filename='server/config/ServiceConfig.js';

//ServiceConfigurationSchema = new Mongo.Collection("meteor_accounts_loginServiceConfiguration");

ServiceConfig = {
	// configurations
	Generic : {
		Dev : {
			service : "chemwiki",
			appId: "98769uyiyohj9876986_jhgfjkg21222.apps.chemwiki.com",
			secret: "1QYX4loolOoV-mzm_80p9JX4_ChemWiki",
		},
		Prod : {
			service : "chemwiki",
			appId: "98769uyiyohj9876986_jhgfjkg21222.apps.chemwiki.com",
			secret: "1QYX4loolOoV-mzm_80p9JX4_ChemWiki",
		}
	},
	Facebook : {
		Dev : {
			service : "facebook",
		    appId : "1470750069818470",
		    secret : "b2b17e3a97b3c93a4c3034787fece677"
		},
		Prod : {
			service : "facebook",
		    appId : "660855753966370",
		    secret : "9c8f724f320faa387eca277cd472c33c"
		}
	},
	Google : {
		Dev : {
			service : "google",
			secret:"1QYX4loolOoV-mzm_80p9JX4",
			clientId:"775190671310-n19etrb7ph4pmlqkkoe5c4svcu9f7b88.apps.googleusercontent.com",
		},
		Prod : {
			service : "google",
		    clientId : "775190671310-n19etrb7ph4pmlqkkoe5c4svcu9f7b88.apps.googleusercontent.com",
		    secret : "1QYX4loolOoV-mzm_80p9JX4"
		}
	},
	Twitter : {
		Dev : {
			service : "twitter",
			secret : "tIHer7vAf4u0wClO8YA0Ion6r5pDaPG8jbo22rwJtBCXUrBBxp",
			consumerKey : "Oz3sZqawSiMv1Mh1Ymd5kgzX8",
		},
		Prod : {
			service : "twitter",
		    secret : "TYKoKT1MWnWzT5EPdK4muGhqPonruw37tec6JudgL4qDky1ZnW",
		    consumerKey : "Qqh3oor6PE7wIZFvJCfrDCJ3m",
		}
	},

	// cleanup & insert methods
	remove : function(service) {
		ServiceConfiguration.configurations.remove({service: service});
	},
	find : function(service, appId, secret) {
		// var config = ServiceConfiguration.configurations.findOne({service: 'eve'});
		qlog.info('service: ' + ServiceConfig.Generic.Prod.service + ', appId: ' + ServiceConfig.Generic.Prod.appId + ', secret: ' + ServiceConfig.Generic.Prod.secret, filename);
		if(ServiceConfig.Generic.Prod.service === service && 
			ServiceConfig.Generic.Prod.appId === appId && 
			ServiceConfig.Generic.Prod.secret === secret) {
			return ServiceConfig.Generic.Prod;
		} else {
			return undefined;
		}
		//return ServiceConfigurationSchema.find({"service" : service, "appId" : appId, "secret" : secret});
	},
	insert : function(svc_config) {
		ServiceConfiguration.configurations.insert(svc_config);
	},
};