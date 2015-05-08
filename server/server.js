var mongo_url=process.env.MONGOHQ_URL;


// server clustering. this works as qoll-server side code. 
// mobile app and analytics will call upon this server to fetch data
// Connect to the cluster with a MongoDB URL. Better if it's a replica set
// MONGO_URL=mongodb://localhost:3002/meteor
//export CLUSTER_DISCOVERY_URL='mongodb://localhost:5002/meteor'

// Register a service to the cluster
//export CLUSTER_ENDPOINT_URL="http://localhost:5000"
//export CLUSTER_SERVICE="qollserver"