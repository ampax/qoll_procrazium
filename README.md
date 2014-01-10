Qoll API & Developer's notes - 
=============================================





API & Package Structure:
------------------------------------


Important tools and plugins:
------------------------------------


```
- npm install -g mongodb
-	Google Chrome
-	Google Chrome Plugin – Resize Window pwd
-	Robomongo – robomongo.org
http://www.iclarified.com/28180/how-to-open-applications-from-unidentified-developers-in-mac-os-x-mountain-lion 
-	Madeye.io sudo npm install –g madeye
-	Screenhero.com
-	WebStorm from Jetbrains - *this is paid so wait till we buy a corporate license*
-	Dev http client - https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm 
-	REST Client - https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/ 
-	Firebug debugger/chrome debugger
-	Node Inspector - https://github.com/node-inspector/node-inspector sudo npm install -g node-inspector
-	Node Inspector - http://howtonode.org/debugging-with-node-inspector
-	Meteor JSHINTRC sudo npm install –g jshint
-	Event Hooks – mrt add event-hooks
-	Meteorite – sudo npm install –g meteorite <<Used to install and run meteor app using atmosphere packages>>
```


Following dependencies to be added for development -

```
16.	Mrt add observatory
17.	Mrt add highcharts
18.	Mrt add bootstrap-3
19.	Mrt add accounts-ui
20.	Mrt add accounts-password
21.	Mrt add accounts-facebook
22.	Meteor add google
23.	Meteor add facebook
24.	Meteor add oauth
25.	Mrt add iron-router
26.	Npm install –g node-inspector
27.	Mrt add inspector
28.	Mrt add chartjs
```

Installing laika - 
Install xcode from itunes and then follow the following steps - 
```
sudo xcodebuild -license
sudo npm install -g phantomjs
sudo npm install -g laika

Start a new instance of mongodb for running laika tests
mongod --smallfiles --noprealloc --nojournal
*Note: if you have not installed mongodb - sudo npm install mongodb*
```

**Checking code into github - **
```
Initialize for git checkin
git init

Add all the files
git add --all
git status

Push the files for commit
git commit -m "Checking first version of the code into organization"
git status

Add the remote origin for push
git remote -v
git remote add origin https://github.com/ampax/qoll_procrazium.git
git remote -v

Create the branch develop and check it out to switch to develop- 
git branch develop
git status
git checkout develop
git status

Push the code to branch develop
git push origin develop
history
```