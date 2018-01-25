[![Build Status](https://travis-ci.org/cbuto/greynoise-visualizer.svg?branch=master)](https://travis-ci.org/cbuto/greynoise-visualizer)
# GreyNoise Visualization Application

A simple web application built to visualize [GreyNoise](https://github.com/Grey-Noise-Intelligence/api.greynoise.io) data. Includes some simple statistics (general stats and time series charts), a table view of the data, and a map to view the general location of the IP addresses that are associated with a particular tag. The frontend is built with Angular and retrieves data from the Flask backend that uses Redis for caching. The Flask backend retrieves data from GreyNoise (with caching), computes statistics, and uses the [MaxMind](https://dev.maxmind.com/geoip/geoip2/geolite2/) database for geolocation of IP addresses.

Excerpt from the [GreyNoise](https://github.com/Grey-Noise-Intelligence/api.greynoise.io) repo:
> GreyNoise is a system that collects and analyzes data on Internet-wide scanners. GreyNoise collects data on benign scanners such as Shodan.io, as well as malicious actors like SSH and telnet worms.

### Table of Contents
**[Getting Started](#getting-started)**<br>
**[Development](#development)**<br>
**[Testing](#testing)**<br>
**[Deployment](#deployment)**<br>
**[License](#license)**<br>
**[Acknowledgments](#acknowledgments)**<br>

## Getting Started

The quickest way [deploy](#deployment) this project is by using docker-compose; however, in order to set up a development environment, follow the steps in the [development](#development) section. 

### Prerequisites

##### For development:

* Python 3.6 
* [GeoLite2 City database](http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz)
* [Node.js](https://nodejs.org/en/download/package-manager/)
* Angular CLI - ```npm install -g @angular/cli```

##### For deployment:

Install Docker and Docker Compose:

* Docker installation instructions: https://docs.docker.com/engine/installation/ 
* Docker Compose installation instructions: https://docs.docker.com/compose/install/

Docker for most Linux distributions:

```bash
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Docker Compose for most Linux distributions:

```bash
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

## Development

### Flask backend:
```bash
cd backend
pip3.6 install -r requirements.txt
wget "geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz"
tar -xvf GeoLite2-City.tar.gz
mv GeoLite2-City*/GeoLite2-City.mmdb .
python3.6 app.py
```

### Angular development server:
```bash
cd frontend
npm install
ng serve
```

## Testing

### Angular:

##### Unit testing:

```
cd frontend
ng test 
```

##### e2e testing:

Either requires the Flask backend to be running locally as shown in the development section or the environment flag can be passed with the "e2e" option to use the containerized Flask backend (docker-compose).

```
cd frontend
ng e2e
```

OR 

```
ng e2e --environment=e2e #sets the api url to http://localhost 
```

### Flask:

```
cd backend
nose2
```

## Deployment

A simple deployment using docker-compose:

There will be some warnings about unset variables; however, they will not cause any issues if SSL is not being used. You can simply ignore these warnings, or set the variables to blank strings 

```bash
docker-compose build
docker-compose up -d
```

##### In order to set up NGINX to use SSL:

The SSL cert and key are set to be in /etc/ssl/certs/greynoise/greynoise.crt and /etc/ssl/certs/greynoise/greynoise.key on the host machine running the containers. See [optional SSL configuration](#optional-ssl-configuration) below to configure cert names/paths.

```bash
export GREYNOISE_NGINX_SSL=true #will enable SSL
export GREYNOISE_SERVER_NAME=localhost #or whatever the server name will be
docker-compose build
docker-compose up -d
```

##### Optional SSL configuration:

The cert/key paths can be changed in the docker-compose.yml file on line 33 and the cert/key names can be changed by setting the GREYNOISE_CERT_NAME environment variable.

```
#sets NGINX to look for /etc/ssl/certs/greynoise/test.crt and /etc/ssl/certs/greynoise/test.key
#unless the paths were changed in the docker-compose file
export GREYNOISE_CERT_NAME=test
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details

## Acknowledgments

* [GreyNoise API](https://github.com/Grey-Noise-Intelligence/api.greynoise.io)
* [Time series function](https://github.com/phyler/greynoise)

