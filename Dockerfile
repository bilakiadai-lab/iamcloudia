# Sert le site statique avec nginx (pour un service Render de type Docker).
FROM nginx:1.27-alpine
ENV PORT=10000
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY site/ /usr/share/nginx/html/
EXPOSE 10000
