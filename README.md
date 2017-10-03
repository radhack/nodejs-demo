# HelloSign-API-Demo

Assuming that you will be deploying this on a clean AWS Fedora/Centos server instance:

1. `sudo yum update`
1. Install git with dependancies `sudo yum install curl-devel expat-devel gettext-devel \
  openssl-devel zlib-devel`
1. Install node package manager: `curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -`
1. Update node package manager: `npm install npm@latest -g`
1. Install node: `sudo yum install -y nodejs`
1. Install node version manager: `sudo npm i -g n`
1. Install nodejs: `sudo n 6.11.2`
1. Set up mongodb:
    1. If you're going to be using a local instance of mongodb install it using the instructions at the following link: https://tecadmin.net/install-mongodb-on-ubuntu/
    1. For an mlab deployment of mongodb add in the following environment variables :
        1. `MONGO_USER` - username for user created in mlab
        1. `MONGO_PASS` - password for user
        1. `MONGO_HOST` - this is everything after the @ symbol in the host address provided in mlab. For example, if the URL is,  `mongodb://<dbuser>:<dbpassword>@ds157723.mlab.com:57723/hellosign`, `MONGO_HOST` would be `ds157723.mlab.com:57723/hellosign`
1. Set environment variables for Hellosign API
    1. `HELLO_KEY` Hellosign API key
    1. `HELLO_ID` Hellosign API app client ID
1. Install g++: `sudo yum install gcc-c++`
1. Install dependencies for color-thief package: `sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel`
1. Clone github repository: `git clone https://github.com/HelloFax/nodejs-demo.git`
1. CD into the nodejs-demo folder and install node packages: `sudo npm i`
1. Install nginx: `sudo yum install nginx`
1. Configure nginx as reverse proxy:
    1. Create a configuration file `sudo vi \etc\nginx\sites-available\default\node-sales-demo.com`
      1. you could use whichever text editor you'd like - this one's vim
    1. Paste in the following configuration (note the domain demo.hellosign.com throughout):
    ```
       server {
            listen 80 default_server;
            listen [::]:80 default_server ipv6only=on;

            server_name demo.hellosign.com;
            return 301 https://demo.hellosign.com;
        }

       server {

            listen 443;
            server_name demo.hellosign.com;

            ssl_certificate           /etc/letsencrypt/live/demo.hellosign.com/fullchain.pem;
            ssl_certificate_key       /etc/letsencrypt/live/demo.hellosign.com/privkey.pem;

            ssl on;
            ssl_session_cache  builtin:1000  shared:SSL:10m;
            ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;
            ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
            ssl_prefer_server_ciphers on;

            access_log            /var/log/nginx/jenkins.access.log;

            location / {

                  proxy_set_header        Host $host;
                  proxy_set_header        X-Real-IP $remote_addr;
                  proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
                  proxy_set_header        X-Forwarded-Proto $scheme;

                  proxy_pass          http://localhost:8000;
                  proxy_read_timeout  90;

                  proxy_redirect      http://localhost:8000 demo.hellosign.com;
            }
       }
    ```
    iii.
    iii. Test nginx configuration with `sudo nginx -t` and restart nginx `sudo service nginx restart`
1. Install certbot and set up certificates:
    From ~ dir
    1. `sudo yum -y install yum-utils`
    1. `yum-config-manager --enable rhui-REGION-rhel-server-extras rhui-REGION-rhel-server-optional`
    1. `wget https://dl.eff.org/certbot-auto`
    1. `chmod a+x certbot-auto`
    1. `sudo ./certbot-auto certonly --standalone -d demo.hellosign.com`
1. Setup automatic certificate renewal:
    1. `sudo crontab -e`
    1. Add the following line: `15 3 * * * ./certbot-auto renew --quiet`
1. Install npm process manager: `sudo npm i -g pm2`
1. Navigate to hellosign nodejs-demo folder and start app with pm2: `pm2 start main.js --name <INSERT PROCESS NAME HERE>`
    1. You can restart the app now using `pm2 restart <PROCESS NAME>` and view streaming logs using `pm2 logs <PROCESS NAME>`

