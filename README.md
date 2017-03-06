# Poengliga
Project for scraping stats from poengliga.no

## Requirements
- Node
- NPM

## Installation
Open project folder in a shell. Run "npm install" to install node packages.

## Running statsFromGames
statsFromGames gets all stats for every game since 2006/2007. 
The application will run for a while and return all stats where a 
player got 20 or more points in a game as a json. 
This can be modified by changing the number 19 in line 127 
and 139 in statsFromGames.js.

Run "node statsFromGames". The application will run on port 8083. 
Open either localhost:8083/herrer or localhost:8083/damer in a browser.

The data will be returned in the browser and also stored in the project folder.

## Running poengliga
poengliga gets all stats for each player registered in poengliga, and thus 
only gets stats from 2011/2012 (men's) and 2012/2013 (women's). It returns 
all players with some info and all stats stored.

Run "node poengliga". The application will run on port 8081. 
Open either localhost:8081/herrer or localhost:8081/damer in a browser.

The data will be returned in the browser and also stored in the project folder.

## Node modules used
- cheerio: jQuery for node. Used to scrape the data.
- express: Web server to run the app.
- iconv: Handling text formatting, poengliga.no is iso-8859-1.
- request: HTTP request client. 