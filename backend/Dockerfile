FROM python:3.6

RUN apt-get update -y

COPY ./backend /app

WORKDIR /app

RUN pip install -r requirements.txt

RUN wget "geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz" \
&& tar -xvf GeoLite2-City.tar.gz \ 
&& mv GeoLite2-City*/GeoLite2-City.mmdb .

RUN chown root:root GeoLite2-City.mmdb

CMD [ "gunicorn", "--workers", "4", \
               "--bind", "0.0.0.0:8080", \
               "-k", "gevent", \
               "--timeout", "300", \
               "app:app" ]
