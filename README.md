[![Build Status](https://travis-ci.org/cbuto/greynoise-visualizer.svg?branch=master)](https://travis-ci.org/cbuto/greynoise-visualizer)
# Greynoise Visualizer Application

A simple web application built to visualize [GreyNoise](https://github.com/Grey-Noise-Intelligence/api.greynoise.io) data. Includes some simple statistics (general stats and time series charts), a table view of the data, and a map to view the location of the IP addresses that are associated with a particular tag. Angular serves as the frontend, Flask as the backend (to retrieve data and compute statistics), and Redis for caching.

Excerpt from the [GreyNoise](https://github.com/Grey-Noise-Intelligence/api.greynoise.io) repo:
> Grey Noise is a system that collects and analyzes data on Internet-wide scanners. Grey Noise collects data on benign scanners such as Shodan.io, as well as malicious actors like SSH and telnet worms.


## Getting Started

The quickest way deploy this project is to use docker-compose. In order to set up a development environment, follow the steps in the development section. 

### Prerequisites

For development:

* Python 3.6 
* [GeoLite2 City database](geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz)
* [Node.js](https://nodejs.org/en/download/package-manager/)
* Angular CLI - ```npm install -g @angular/cli```

For deployment:

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

Flask backend:
* ```cd backend```
* ```pip3.6 install -r requirements.txt```
* ```wget "geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz"```
* ```tar -xvf GeoLite2-City.tar.gz```
* ```mv GeoLite2-City\*/GeoLite2-City.mmdb .```
* ```python3.6 app.py```

Angular development server:
* ```cd frontend```
* ```npm install```
* ```ng serve```

## Deployment

A simple deployment using docker-compose:

```bash
docker-compose build
docker-compose up -d
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details

## Acknowledgments

* [GreyNoise API](https://github.com/Grey-Noise-Intelligence/api.greynoise.io)
* [Time series function](https://github.com/phyler/greynoise)

