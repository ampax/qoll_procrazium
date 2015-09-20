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
		|				|____accounts
		|				|____autocomplete
		|				|____chart
		|				|____datepicker
		|				|____downtown
		|				|____helpers
		|				|____intro
		|				|____meteor
		| 		   |
		| 		    ---stylesheets
		| 		   |
		| 		    ---views
		|				|
		|				|____admin
		|				|____body
		|				|____chart
		|				|____common
		|				|____contacts
		|				|____editor
		|				|		|____aceedit
		|				|		|____ckedit
		|				|____edu
		|				|____header
		|				|____layout
		|				|____mockups
		|				|____qoll
		|				|____questionaire
		|				|____users
		|
		|
		 ---collections
		|
		|
		 ---db_docs
		|
		|
		 ---lib
		| 		   |
		| 		    ---i18n
		| 		   |
		| 		    ---locales
		|
		|		
		 ---packages
		| 		   |
		| 		    ---accounts-ui-bootstrap-3-blaze
		| 		   |
		| 		    ---ace-embed		
		| 		   |
		| 		    ---animate-css
		| 		   |
		| 		    ---autocompletion
		| 		   |
		| 		    ---blaze-layout
		| 		   |
		| 		    ---bootstrap-3
		| 		   |
		| 		    ---chartjs
		| 		   |
		| 		    ---crypto-base
		| 		   |
		| 		    ---crypto-md5
		| 		   |
		| 		    ---fast-render
		| 		   |
		| 		    ---font-awesome
		| 		   |
		| 		    ---google-contacts
		| 		   |
		| 		    ---googleAnalytics
		| 		   |
		| 		    ---HTML5-History-API
		| 		   |
		| 		    ---inspector
		| 		   |
		| 		    ---iron-router
		| 		   |
		| 		    ---jquery-ui
		| 		   |
		| 		    ---mathjax
		| 		   |
		| 		    ---meteor-tomarkdown
		| 		   |
		| 		    ---module-loader
		| 		   |
		| 		    ---npm
		| 		   |
		| 		    ---page-js-ie-support
		| 		   |
		| 		    ---pince
		| 		   |
		| 		    ---wow
		|
		|
		 ---public
		| 			|
		| 			 ---ckeditor
		| 			|
		| 			 ---img
		|			|
		|			 ---TeX
		|
		---server
		|           |
		| 			 ---admin
		| 			|
		| 			 ---config
		| 			|
		| 			 ---db
		| 			|
		| 			 ---lib
		| 			|
		| 			 ---publish
		|
		 ---

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
Check out a specific change list of code
- git pull origin bc69283ea8f019304e4653a488b6d0530df7366a
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

##Installing imagemagic##
We will be using wget to install this (you can do the same using curl or any other linux/mac utility)

Install wget (on mac), if you already dont have it [wget]- 
```
cd ~/Downloads
curl -O http://ftp.gnu.org/gnu/wget/wget-1.15.tar.gz
tar -zxvf wget-1.15.tar.gz
cd wget-1.15/
./configure

// if error happens? - configure: error: --with-ssl was given, but GNUTLS is not available. do following - 
./configure --with-ssl=openssl

make
sudo make install
// wget installed in the following location - 
/usr/local/bin/wget

// clean the download folder now
rm -rf ~/Downloads/wget*
```

Installing graphicsmagic now [graphicsmagic] -
```
cd ~/Downloads
wget http://sourceforge.net/projects/graphicsmagick/files/graphicsmagick/1.3.21/GraphicsMagick-1.3.21.tar.gz
tar -zxvf GraphicsMagick-1.3.21.tar.gz
cd GraphicsMagick-1.3.21/
./configure

make
sudo make install

// confirm the installation
gm display
```




##Additional resources##

Learn how to write better mark-down (.md/README.md) files - [daringfireball]

[daringfireball]: http://daringfireball.net/projects/markdown/syntax "Write Better Markdown"
[meteor-npm]: https://github.com/arunoda/meteor-npm "Add npm to meteor"
[complete-npm-integration]: http://meteorhacks.com/complete-npm-integration-for-meteor.html "Complete Npm Integration"
[wget]: http://coolestguidesontheplanet.com/install-and-configure-wget-on-os-x/ "wget"
[graphicsmagic]: http://www.graphicsmagick.org/INSTALL-unix.html "read more here"

