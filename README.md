#Qoll API & Developer's notes - #





##API & Package Structure:##
------------------------------------
####We are following the standard package structure for this project -####
```
qoll----
		|
		 ---client
		| 		   |
		| 		    ---lib
		| 		   |
		| 		    ---stylesheets
		| 		   |
		| 		    ---views
		|
		 ---lib
		|
		 ---server
		| 			|
		| 			 ---config
		| 			|
		| 			 ---db
		| 			|
		| 			 ---lib
		| 			|
		| 			 ---publish
		|
		 ---public
		| 			|
		| 			 ---img
		|
		 ---tests

```





##Important tools, plugins, and commands:##


####Install following tools/plugins on your machine so that you have some basic and advanced tools to start developing - ####

```
- npm install -g mongodb
-	Google Chrome
-	Google Chrome Plugin – Resize Window pwd
-	Robomongo – robomongo.org
http://www.iclarified.com/28180/how-to-open-applications-from-unidentified-developers-in-mac-os-x-mountain-lion 
-	Madeye.io sudo npm install –g madeye
-	Screenhero.com
-	WebStorm from Jetbrains - *this is paid so wait till we buy a corporate license*
-   Sublime editor - 
-	Dev http client - https://chrome.google.com/webstore/detail/dev-http-client/aejoelaoggembcahagimdiliamlcdmfm 
-	REST Client - https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm/ 
-	Firebug debugger/chrome debugger
-	Node Inspector - https://github.com/node-inspector/node-inspector sudo npm install -g node-inspector
-	Node Inspector - http://howtonode.org/debugging-with-node-inspector
-	Meteor JSHINTRC sudo npm install –g jshint
-	Event Hooks – mrt add event-hooks
-	Meteorite – sudo npm install –g meteorite <<Used to install and run meteor app using atmosphere packages>>
-   meteor add jquery
-   mrt add accounts-ui-bootstrap-dropdown
	Refer to if you have issues with blaze - https://github.com/EventedMind/blaze-layout/issues/3
```


####Installing laika (Install xcode from itunes and then follow the following steps) - ####
```
-  sudo xcodebuild -license
-  sudo npm install -g phantomjs
-  sudo npm install -g laika
Start a new instance of mongodb for running laika tests
-  mongod --smallfiles --noprealloc --nojournal
Note: if you have not installed mongodb - sudo npm install mongodb
```



####Checking code into github -####
```
Initialize for git checkin
-  git init
Add all the files
-  git add --all
-  git status
Push the files for commit
-  git commit -m "Checking first version of the code into organization"
-  git status
Add the remote origin for push
-  git remote -v
-  git remote add origin https://github.com/ampax/qoll_procrazium.git
-  git remote -v
Create the branch develop and check it out to switch to develop- 
-  git branch develop
-  git status
-  git checkout develop
-  git status
Push the code to branch develop
-  git push origin develop
-  history
Revert back to commit version
- git reset --hard <old-commit-id>
- git push -f
```

####Repair mongodb if you get an error while connecting in local
```
sudo rm /var/lib/mongodb/mongod.lock
sudo mongod --dbpath /var/lib/mongodb/ --repair
sudo mongod --dbpath /var/lib/mongodb/ --journal

Run "vim /etc/mongodb.conf" and chech "dbpath=/data/db". You should have this setup.
Run mongo to start the console and run some commands to check the application status.
```
Sample mongodb-conf file
```
fork = true
bind_ip = 127.0.0.1
port = 27017
quiet = true
dbpath = /var/lib/mongodb
logpath = /var/log/mongodb/mongod.log
logappend = true
journal = true
```


####Adding npm/marked to the project
Add npm to the project to add marked to the project [meteor-npm], [complete-npm-integration]
```
mrt add npm
npm install -g meteor-npm #single time operation
meteor-npm #type inside your project

Now edit root/packages.json <<Not package.json>> file and add the following - 
"marked": "0.3.1" 
```

Find Meteor process, kill it (if hidden), and reset the project
```
ps -x | grep meteor
kill -9 <pid>
mrt reset
or
meteor reset
```

Now you can start adding server side code for mark-down processing. If you add client-side processing, it
will not work. Search for downtown handlebar template to get an idea.


##Additional resources##

Learn how to write better mark-down (.md/README.md) files - [daringfireball]

[daringfireball]: http://daringfireball.net/projects/markdown/syntax "Write Better Markdown"
[meteor-npm]: https://github.com/arunoda/meteor-npm "Add npm to meteor"
[complete-npm-integration]: http://meteorhacks.com/complete-npm-integration-for-meteor.html "Complete Npm Integration"
