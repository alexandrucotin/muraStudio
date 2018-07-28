FROM nginx:latest

RUN apt-get update && apt-get install -y vim curl

COPY nginx.conf /etc/nginx/nginx.conf
COPY build /var/www
