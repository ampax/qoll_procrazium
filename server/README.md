#Server Package - #

##Package information - ##
-----------------------------

The server package hosts everything that is loaded and run only on server. Client will have no access to the data and API on server side. All the sensitive data and it'sprocessing must be limited to this page. A violation will result in data-breach and further security issues.

####The package structure looks like the following - ####
```
server--
		|
		 ---config
		|
		|
		 ---db
		|
		|
		 ---lib
		|
		|
		 ---publish
		|
		 ---Accounts.js
		|
		---Config.js
		|
		---Init.js
```


######config - ######
This package wil have all the helping classes to help Config.js configure the server at startup. Today we are keeping site validation settings with facebook, google, twitter, etc in this package. Anything that needs to be loaded/run at server startup for configuration should be put in this package.

######db - ######
db package will have everything that accesses database directly (with exception of publishers). Make sure that the database access classes have appropriate allow/deny rules defined. This will make the db accessros completely functional as per the standards.

######lib - ######
lib will have anything that is common to the server side class. debug.js has server debugging capablity.

######publish - ######
Publishers are the modst important components of our application. Any data requested by client, will be published by the publishers. The client will subscribe to the publisher, in reactive or non-reactive ways to recieve the data load.

######Accounts.js - ######
When user loggs in the first time using an external service, facebook, google, or anything else, Meteor.onCreateUser captures the user information sent from the remote url. If we need any further information (for which user consent is not required), we will do it from here.

When the user loggs into Qoll the first time, Qoll will collect the basic minimum information from the partner websites, and store them into USERS collection. After user starts using the Qoll and wants to send some Qolls to a fecebook friend or twitter friend, Qoll will ask to access additional user information from the partner website. Upon positive response from user, Qoll will fetch the extra information, and update USERS. Upon declining from user, no action will be taken and user will be informed that they can not post to facebook user since we can not access friend's facebook wall.

>Note: User can post the Qoll to an email-id. In this case no consent and information gathering will be required.
> This class needs to be broken down and helper classes needs to be put in auth package.

######Config.js - ######
Config.js will have everything that needs to configure the server on startup.

######Init.js - ######
Init.js will further help initialize the server on startup. As of today, this is empty. We will know what to put into it in future.