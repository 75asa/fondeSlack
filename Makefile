#!make
# include envfile
include .env
export $(shell sed 's/=.*//' .env)
# export $(shell sed 's/=.*//' .env)

WEBHOOK_URL := ${WEBHOOK_URL}

dev:
	curl -X POST -H 'Content-type: application/json' -d  @mock.json ${WEBHOOK_URL}
prd:
	curl -X POST -H 'Content-type: application/json' -d  @mock.json ${WEBHOOK_URL}
hoge:
	echo $(PORT)
	# env

