# Stage 0, based on Node.js, to build and compile Angular

FROM node:9.3.0-alpine as node

WORKDIR /app

COPY ./frontend/package.json /app/

RUN npm install

COPY ./frontend /app/

RUN npm run build --prod

# Stage 1 - Serve compiled code with NGINX

FROM nginx:alpine

RUN apk update && apk upgrade

RUN rm -rf /etc/nginx/nginx.conf
 
COPY ./nginx/nginx*.conf /etc/nginx/

ARG NGINX_SSL

ARG SERVER_NAME

ARG CERT_NAME

RUN sh -c 'if [ "$NGINX_SSL" = true ]; then mv /etc/nginx/nginx-ssl.conf /etc/nginx/nginx.conf && sed -i -e 's/localhost/${SERVER_NAME}/g' /etc/nginx/nginx.conf; fi'

RUN sh -c 'if [ "$CERT_NAME" != "" ] && [ "$NGINX_SSL" = true ]; then sed -i -e 's/greynoise/${CERT_NAME}/g' /etc/nginx/nginx.conf; fi'

COPY --from=node /app/dist /usr/share/nginx/html/

RUN chmod -R 0755 /usr/share/nginx/html/
