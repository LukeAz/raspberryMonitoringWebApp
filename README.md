# raspberryMonitoringWebApp
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup and run](#setup-and-run)
* [Configuration](#configuration)
* [System service](#service)

## General info
This project contains a webapp to monitor the performance of the raspberry pi and its temperatures.
It was developed using the express framework.

This script uses vsgencmd, firmware present by default on raspberry. In case it is not present you can find the pre compiled on the official repository of raspberry pi (https://github.com/raspberrypi/firmware/tree/master/hardfp/opt/vc).
You must download the vcgencmd file and insert it in '/opt/vc/bin/vcgencmd'.

![Layout](https://github.com/LukeAz/raspberryMonitoringWebApp/blob/main/img/layout.png)

## Technologies
Project is created with:
* Express Nodejs
* Websocket
* Node os utils
	
## Setup and run
To run this project, install it locally:

```
$ git clone https://github.com/LukeAz/raspberryMonitoringWebApp.git
$ cd raspberryMonitoringWebApp
$ npm install
$ nano config.json
$ npm start
```

## Configuration
To customize the script settings you need to edit the 'config.json' file.

```
$ nano config.json
```

Explanation:
* EXPRESS_PORT: port of the web server;
* WS_PORT: port of the webSocket;
* HOST: host url, example localhost (127.0.0.1) or internal ip (192.168.1.111);
* MAX_TEMP: maximum temperature in degrees Celsius (For color graphics).

## Service
In the repository there is an example in the file 'raspberryMonitoringWebAppExample.service' to insert the script into the system services.
It is necessary to edit the working directory within it.

```
$ nano raspberryMonitoringWebAppExample.service
$ cp raspberryMonitoringWebAppExample.service /etc/systemd/system/
$ sudo systemctl enable raspberryMonitoringWebAppExample
$ sudo systemctl start raspberryMonitoringWebAppExample
```
To stop the service:
```
$ sudo systemctl stop raspberryMonitoringWebAppExample
```
To delete the service:
```
$ sudo systemctl disable raspberryMonitoringWebAppExample
$ sudo rm /etc/systemd/system/raspberryMonitoringWebAppExample.service
```
