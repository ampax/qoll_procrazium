var filename='server/app.js';

// Connect to the cluster with a MongoDB URL. Better if it's a replica set
var connectOptions = {
  // Value of 0 to 1, mentioning which portion of requestes to process here or proxy
  // If 1, all the requests allocated to this host will get processed
  // If 0.5 half of the requsted allocated to this host will get processed, others will get proxied
  // If 0, only do proxying 
  selfWeight: 1 // optional
};


//Cluster.connect('mongodb://localhost:5002/meteor', connectOptions);
//Cluster.register('qollserver');

var mongo_url = SITE_URL.replace(/http/, 'mongodb') + '/meteor';

qlog.info('Starting cluster connection and connecting to mongodb - ' + mongo_url, filename);

// Cluster.connect("mongodb://localhost:3001/meteor");

/**
Cluster.connect(mongo_url);
Cluster.register("qollserver");
Cluster.allowPublicAccess("qollserver");
**/