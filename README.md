[![Build Status](https://travis-ci.org/cbuto/greynoise-visualizer.svg?branch=master)](https://travis-ci.org/cbuto/greynoise-visualizer)

# Greynoise Visualizer Application

A simple web application built with Angular and Flask to visualize [GreyNoise](https://github.com/Grey-Noise-Intelligence/api.greynoise.io) data. Includes some simple statistics (general stats and time series charts) and a table view of the data. 

## Getting Started

The easiest way to get started with this project is to use docker-compose.

### Prerequisites

For development:

* python 3.6 
* [Node.js](https://nodejs.org/en/download/package-manager/)
* Angular CLI 
** ```npm install -g @angular/cli```

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

