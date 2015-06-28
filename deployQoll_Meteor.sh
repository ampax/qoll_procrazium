#!/bin/sh

echo 'Deploying at Meteor, options: '


echo 'Check log or deploy app? '
echo "		* log"
echo "		* deploy"

read read_mode

echo $read_mode

if [ "$read_mode" == "log" ] ; then
	echo 'Enter environment identifier (dev or stage or prod) to read logs:'
	echo "		** dev"
	echo "		** stage"
	echo "		** prod"

	read env_ident

	echo $env_ident

	if [ "$env_ident" == "dev" ] ; then
		echo 'Reading logs for qoll'$env_ident.meteor.com
		sudo meteor logs 'qoll'$env_ident.meteor.com
	elif [ "$env_ident" == "stage" ] ; then
		echo 'Reading logs for qoll'$env_ident.meteor.com
		sudo meteor logs 'qoll'$env_ident.meteor.com
	elif [ "$env_ident" == "prod" ] ; then
		echo 'Reading logs for qoll'$env_ident.meteor.com
		sudo meteor logs 'qoll'$env_ident.meteor.com
	else echo 'Enter dev or stage or prod. '$env_ident' is not recongnized for reading logs.'
	fi
elif [ "$read_mode" == "deploy" ] ; then
	echo 'Enter environment identifier (dev or stage or prod) to deploy app:'
	echo "		** dev"
	echo "		** stage"
	echo "		** prod'"

	read env_ident

	echo $env_ident

	if [ "$env_ident" == "dev" ] ; then
		echo 'Deploying to qoll'$env_ident.meteor.com
		sudo meteor deploy 'qoll'$env_ident.meteor.com
	elif [ "$env_ident" == "stage" ] ; then
		echo 'Deploying to qoll'$env_ident.meteor.com
		sudo meteor deploy 'qoll'$env_ident.meteor.com
	elif [ "$env_ident" == "prod" ] ; then
		echo 'Deploying to qoll'$env_ident.meteor.com
		sudo meteor deploy 'qoll'$env_ident.meteor.com
	else echo 'Enter dev or stage or prod. '$env_ident' is not recongnized for deplying app.'
	fi
else echo 'Enter log or deploy for mode. '$read_mode' is not recongnized.'
fi

# echo 'qoll'$1.meteor.com

# sudo meteor deploy 'qoll'$env_ident.meteor.com