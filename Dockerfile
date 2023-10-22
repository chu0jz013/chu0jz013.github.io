FROM nginx:latest

ENV NGINX_DOMAIN quachuoitrenmay.online

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY dist/ ./

RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/conf.d/default.conf && \
    echo "    server_name $NGINX_DOMAIN;" >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

RUN nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]