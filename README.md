Developer's guide to tools & basic commands - 
=============================================

Tool list to kick start development:
------------------------------------


```
0.1 npm install -g mongodb

1.	Google Chrome
2.	Google Chrome Plugin – Resize Window pwd
3.	Robomongo – robomongo.org
http://www.iclarified.com/28180/how-to-open-applications-from-unidentified-developers-in-mac-os-x-mountain-lion 
4.	Madeye.io sudo npm install –g madeye
5.	Screenhero.com
6.	WebStorm from Jetbrains
7.	Dev http client - https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm 
8.	REST Client - https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/ 
9.	Firebug debugger/chrome debugger
10.	Node Inspector - https://github.com/node-inspector/node-inspector sudo npm install -g node-inspector
11.	Node Inspector - http://howtonode.org/debugging-with-node-inspector
12.	Meteor JSHINTRC sudo npm install –g jshint
13.	Install xcode - http://guide.macports.org/chunked/installing.xcode.html#installing.xcode.mavericks 
14.	Event Hooks – mrt add event-hooks
15.	Meteorite – sudo npm install –g meteorite <<Used to install and run meteor app using atmosphere packages>>
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
Note: if you have not installed mongodb - sudo npm install mongodb
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