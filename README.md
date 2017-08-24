# nodejs-demo
API Demo for Hellosign written in NodeJS.

## Install
1. Create a Heroku account
1. Create a mongodb account on mlab
1. Create a database
1. Create a user for the database (edited)
1. Create a heroku app
1. Add the following environment variables :
  1. `MONGO_USER` - username for user created in mlab
  1. `MONGO_PASS` - password for user
  1. `MONGO_HOST` - this is everything after the @ symbol in the host address provided in mlab. For example, if the URL is,  `mongodb://<dbuser>:<dbpassword>@ds157723.mlab.com:57723/hellosign`, `MONGO_HOST` would be `ds157723.mlab.com:57723/hellosign`
  1. `HELLO_KEY` Hellosign API key
  1. `HELLO_ID` Hellosign API app client ID
1. Deploy app
1. Set the callback URL to the Heroku app in the Hellosign API app settings
