
dir="`pwd`"

cd /home/admin/source
mvn clean package -Dmaven.test.skip=true

cd "$dir"
