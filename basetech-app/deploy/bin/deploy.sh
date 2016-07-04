tomcat_dir=/usr/share/tomcat
logs_dir=/home/admin/logs
webapps_dir=/home/admin/webapps

rm -rf /home/admin/conf
cp -r /home/admin/source/deploy/conf /home/admin/

PID=`ps -ef|grep nginx.conf|grep -v grep|awk '{print $2}'`
kill -QUIT ${PID}

sleep 5
nginx -c /home/admin/conf/nginx.conf

/usr/libexec/tomcat/server stop
sleep 5
killall java
sleep 5

if [ "$1" == "cleanlog" ]; then
        rm -rf $logs_dir
fi

rm -rf /home/admin/assets
cp -R /home/admin/source/assets /home/admin/assets


rm -rf $webapps_dir/*

cp /home/admin/source/app/target/app.war $webapps_dir

/usr/libexec/tomcat/server start
sleep 5