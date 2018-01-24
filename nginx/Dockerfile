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

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=node /app/dist /usr/share/nginx/html/

RUN chmod -R 0755 /usr/share/nginx/html/
