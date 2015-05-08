CLUSTER_DISCOVERY_URL=mongodb://localhost:3001/meteor \
CLUSTER_SERVICE="qollserver" \
CLUSTER_ENDPOINT_URL=http://localhost:3000 \
ROOT_URL=http://www.mydomainname.com \
sudo meteor --port 3000






sudo CLUSTER_DISCOVERY_URL=mongodb://localhost:3002/meteor CLUSTER_SERVICE="qollserver" CLUSTER_ENDPOINT_URL=http://localhost:3000 ROOT_URL=http://www.mydomainname.com sudo meteor --port 3000