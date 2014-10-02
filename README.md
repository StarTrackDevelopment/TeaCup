teacup
======

Preconditions: 
1) install nodejs & configure proxy
2) install git & configure proxy
3) install bower & grunt-cli global
4) configure proxy for bower

Running the app:

1) for the first time: install all app dependencies by calling "npm install"
2) run "MongoDB-RunCommandLine.bat" to setup and start mongodb.
   (Source: http://www.codeproject.com/Articles/743051/MongoDB-Installation-Scripts-for-Windows)
3) run "setup_db.bat" to insert testdata.
   find database "teacup_db" and table "teacups" 
4) call npm start or grunt to execute the app