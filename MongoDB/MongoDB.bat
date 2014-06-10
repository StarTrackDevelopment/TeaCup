:: -------------------------------------------------
:: ----- STEP 1: TEST FOR REQUIRED VARIABLES   -----
:: -------------------------------------------------

:: Check if the InstallWindowsService variable has been passed in.
IF /I NOT "%InstallWindowsService%"=="true" (
	IF /I NOT "%InstallWindowsService%"=="false" (
		echo NOTICE: Do NOT run this batch file directly.
		echo NOTICE: This file is called by the MongoDB-RunCommandLine.bat and MongoDB-ServiceInstall.bat files.
		echo ERROR: InstallWindowsService variable must be set to "true" or "false".
		pause
		goto End
	)
)

:: -------------------------------------------------
:: ----- STEP 2: SET CONFIGURATION VARIABLES   -----
:: -------------------------------------------------
echo -------------------- CONFIGURATION --------------------

echo InstallWindowsService: [%InstallWindowsService%]

:: Set the port number (the MongoDB default is 27017).
set PortNumber=27017
echo PortNumber: [%PortNumber%]

:: Define the full path to the installer base directory.
::   NOTE: By default this is set to the current directory, so that 
::         a user can simply double-click on the batch file, and
::         have everything run out of the current directory!
set BaseDirectory=%CD%
echo BaseDirectory: [%BaseDirectory%]

:: Define the path to the MongoDB directory.
set MongoDbDirectory=%BaseDirectory%\mongodb
echo MongoDbDirectory: [%MongoDbDirectory%]

:: Define the path to the MongoDB executable file.
set MongodExecutablePath=%MongoDbDirectory%\bin\mongod.exe
echo MongodExecutablePath: [%MongodExecutablePath%]

:: Define the path to the Data Directory.
set DataDirectory=%BaseDirectory%\data
echo DataDirectory: [%DataDirectory%]
set DbDirectory=%DataDirectory%\db
echo DbDirectory: [%DbDirectory%]

:: Define the path to the Log Directory.
set LogDirectory=%BaseDirectory%\log
echo LogDirectory: [%LogDirectory%]

:: Define the path to the Log File. (Also, give the log file a unique name so that we know when MongoDB gets restarted).
for /f "skip=1" %%x in ('wmic os get localdatetime') do if not defined LogFileTimestamp set LogFileTimestamp=%%x
set LogFilePath=%LogDirectory%\MongoDbLog-%LogFileTimestamp%.log
echo LogFilePath: [%LogFilePath%]

:: Define the path to the MongoDB Configuration File.
set ConfigFilePath=%BaseDirectory%\mongod.conf
echo ConfigFilePath: [%ConfigFilePath%]

echo -------------------------------------------------------
echo.

:: -------------------------------------------------
:: ----- STEP 3: TEST THE ENVIRONMENT          -----
:: -------------------------------------------------

:: Check if the Base Directory exists.
IF NOT EXIST "%BaseDirectory%" (
	echo ERROR: Base directory does not exist ["%BaseDirectory%"].
	echo ERROR: Command Aborted: MongoDB was NOT started.
	goto End
)

:: Check if the MongoDB Directory exists.
IF NOT EXIST "%MongoDbDirectory%" (
	echo ERROR: MongoDB directory does not exist ["%MongoDbDirectory%"].
	echo ERROR: Command Aborted: MongoDB was NOT started.
	goto End
)

:: Check if the mongod Executable File exists.
IF NOT EXIST "%MongodExecutablePath%" (
	echo ERROR: Mongod executable file does not exist ["%MongodExecutablePath%"].
	echo ERROR: Command Aborted: MongoDB was NOT started.
	goto End
)

:: Check if the Data Directory exists.
IF NOT EXIST "%DataDirectory%" (
	:: Create the missing directory.
	mkdir "%DataDirectory%"
)

:: Check if the DB Directory exists.
IF NOT EXIST "%DbDirectory%" (
	:: Create the missing directory.
	mkdir "%DbDirectory%"
)

:: Check if the Log Directory exists.
IF NOT EXIST "%LogDirectory%" (
	:: Create the missing directory.
	mkdir "%LogDirectory%"
)

:: -------------------------------------------------
:: ----- STEP 4: CREATE THE LOG FILE           -----
:: -------------------------------------------------

:: Create the Log File ONLY IF it does not already exist.
IF NOT EXIST "%LogFilePath%" (
	copy nul "%LogFilePath%" > nul
)

:: -------------------------------------------------
:: ----- STEP 5: CREATE THE CONFIGURATION FILE -----
:: -------------------------------------------------

:: Create a default Mongo Configuration File, if one does not already exist.
IF NOT EXIST "%ConfigFilePath%" (
	echo NOTICE: Mongo DB configuration file does not exist.

	:: Overwrite any existing configuration file.
	echo.> "%ConfigFilePath%"

	:: Set the path to Data Directory (must be an absolute path). (NOTE: Do not encapsulate in double quotes!)
	echo dbpath = %DbDirectory% >> "%ConfigFilePath%"

	:: Set the path to the log file (must be an absolute path). (NOTE: Do not encapsulate in double quotes!)
	echo logpath = %LogFilePath% >> "%ConfigFilePath%"

	:: Prevent log file from being overwritten every time MongoDB is restarted.
	echo logappend = true >> "%ConfigFilePath%"

	:: Enable verbose logging.
	echo verbose = true >> "%ConfigFilePath%"

	:: Set the port number.
	echo port = %PortNumber% >> "%ConfigFilePath%"

	:: Require user authentication (localhost will have access until the first user is created).
	echo auth = true >> "%ConfigFilePath%"

	echo NOTICE: A default configuration file has been created ["%ConfigFilePath%"].
	echo NOTICE: Customize this file as needed, and be sure to save a backup!
	echo.
)
:: -------------------------------------------------
:: ----- STEP 6: START MONGO DB                -----
:: -------------------------------------------------

:: Run the MongoDB executable.
IF /I "%InstallWindowsService%"=="true" (
	"%MongodExecutablePath%" --config "%ConfigFilePath%" --install
) ELSE (
	"%MongodExecutablePath%" --config "%ConfigFilePath%"
)

:: -------------------------------------------------
:: ----- STEP 7: END-OF-SCRIPT LABEL           -----
:: -------------------------------------------------

:: Place the 'End' label here (used by GOTO commands to skip to the end of the script).
:End
