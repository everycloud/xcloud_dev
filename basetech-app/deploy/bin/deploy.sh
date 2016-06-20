

tomcat_dir=/home/admin/tomcat
logs_dir=/home/admin/logs
webapps_dir=/home/admin/webapps

env_config=/home/admin/acc.conf
env=""
env="`grep '^env' $env_config | cut -d= -f2`"
if [ "$env" != "" ]; then
        JAVA_OPTS=" -Dspring.profiles.active=$env "
        export JAVA_OPTS
fi

echo "关闭tomcat ..."
sh $tomcat_dir/bin/shutdown.sh
echo "等待tomcat shutdown"
sleep 5
killall java
sleep 5


if [ "$1" == "cleanlog" ]; then
	echo "删除旧的日志文件"
	rm -rf $logs_dir
fi

echo "更新静态资源"
rm -rf /home/admin/assets
cp -R /home/admin/source/assets /home/admin/assets


echo "清空tomcat webapps目录"
rm -rf $webapps_dir/*

echo "复制war包到tomcat..."
cp /home/admin/source/app/target/app.war $webapps_dir

echo "启动tomcat ..."
sh $tomcat_dir/bin/startup.sh
sleep 5
echo "tomcat 启动完成"

