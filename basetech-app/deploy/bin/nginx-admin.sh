
if [ $# != 1 ]; then
 	echo "usage: nginx-admin start|stop|restart"
	exit 0;
fi

NGINX_CONFIG=/home/admin/conf/nginx.conf

if [ "$1" == "start" ]; then
	sudo nginx -c "$NGINX_CONFIG"
elif [ "$1" == "stop" ]; then
	sudo nginx -s quit -c "$NGINX_CONFIG"
elif [ "$1" == "restart" ]; then
	sudo nginx -s reload -c "$NGINX_CONFIG"
else
	echo "usage: nginx-admin start|stop|restart"
fi

