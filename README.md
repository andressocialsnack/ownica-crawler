# ownica-spiders

Spiders for [ownica](https://ownica.com)

## To deploy

	1. create an account in some cloud (google cloud, aws, azure, digital ocean)
	1. create a VM
	1. create a DB
	1. set the environment variables (see prisma/env-sample)
	1. run migrations
	1. set up cloud scheduler or cron jobs. 
	1. connect github to cloud build or equivalent
	1. build, will deploy automatically
