#!/bin/sh

echo 'Deploying at Meteor'

echo 'Enter environment identifier (dev or stage or prod):'

read env_ident

echo $env_ident

if [ "$env_ident" == 'dev' ] ; then
	echo 'Deploying to qoll'$env_ident.meteor.com
	sudo meteor deploy 'qoll'$env_ident.meteor.com
elif [ "$env_ident" == 'stage' ] ; then
	echo 'Deploying to qoll'$env_ident.meteor.com
	sudo meteor deploy 'qoll'$env_ident.meteor.com
elif [ "$env_ident" == 'prod' ] ; then
	echo 'Deploying to qoll'$env_ident.meteor.com
	sudo meteor deploy 'qoll'$env_ident.meteor.com
else echo 'Enter dev or stage or prod. '$env_ident' is not recongnized.'
fi

# echo 'qoll'$1.meteor.com

# sudo meteor deploy 'qoll'$env_ident.meteor.com