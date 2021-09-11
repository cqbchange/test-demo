FROM youhui-registry-vpc.cn-shanghai.cr.aliyuncs.com/foundation/npm:6.4.16 as build

COPY ./package.json /opt/
RUN npm install

COPY ./ /opt/
RUN npm run build


FROM livehl/nginx
COPY --from=build ["/opt/dist","/usr/share/nginx/html"]
#COPY ["nginx.conf", "/etc/nginx/nginx.conf"]
EXPOSE 80
CMD ["/bin/sh","-c", "nginx -g 'daemon off;'"]