# nodejs-demo
API Demo for Hellosign written in NodeJS.
---
## Update static urls and port
This project includes some static urls in the controllers/control.form.js that need to be updated with our actual site's
url (no protocol, just site.com), and the callback url (which would be http(s)://site.com/callback)

NOTE: the PORT used in this project is 9000 to get around protected low ports. You can easily change the port in the project by updating main.js on the line `server.listen(process.env.PORT || 80);`

Also, we'll need to decide which HelloSign account's API Key we'll use, and we'll have to create the first app under that account and get the client_id

## MongoDB
This integration requires MongoDB, and some environment variables, to operate.
1. Create a mongodb account on mlab (this is the easiest option, but if you have a mongodb instance up and a user for the db and the url for the host address, you can skip to the AWS Section)
2. Create a database in mlab
3. Create a user for the database in mlab

## AWS
1. Create new linux/fedora instance in aws
2. ssh into it as the ec2 user
3. make sure you're in the ~ dir
4. install node: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
5. install git: `sudo yum install git`
6. make a directory for the node app
7. cd into your new dir and clone the repo: `git clone https://github.com/HelloFax/nodejs-demo.git`
8.  cd into the root of the project (where main.js and package.json live), and install cairo: 
`sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel`
Here are the intructions just in case (you can't run just the `npm install cairo` package - the dependancies will break)
9. install the project dependancies: `npm install`
10. assuming no errors, you should now be able to spin up the node server. You'll need these env variables:
   * `MONGO_USER` - username for user created in mlab
   * `MONGO_PASS` - password for user
   * `MONGO_HOST` - this is everything after the @ symbol in the host address provided in mlab. For example, if the URL is,  `mongodb://<dbuser>:<dbpassword>@ds157723.mlab.com:57723/hellosign`, `MONGO_HOST` would be `ds157723.mlab.com:57723/hellosign`
   * `HELLO_KEY` Hellosign API key
   * `HELLO_ID` Hellosign API app client ID
   
so it'd be something like: `MONGO_USER=adminherp MONGO_PASS=adminderp MONGO_HOST=ds115124.mlab.com:15124/derpnode HELLO_KEY=[API_KEY_HERE] HELLO_ID=[CLIENT_ID_HERE] node main.js`
11. Map the port 80 to the port you used (9000 again is the default)

--- these are the original instructions for Heroku, which do not work since cairo cannot run on Heroku ---
## Install (this is busted because of a package resourse called cairo, which won't run on heroku for some reason)
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
