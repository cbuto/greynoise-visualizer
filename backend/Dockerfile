FROM python:3.6

RUN apt-get update -y

COPY ./backend /app

WORKDIR /app

RUN pip install -r requirements.txt

CMD [ "gunicorn", "--workers", "2", \
               "--bind", "0.0.0.0:8080", \
               "-k", "gevent", \
               "--timeout", "300", \
               "app:app" ]
