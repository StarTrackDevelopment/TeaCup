cd ..
mkdir data
mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"