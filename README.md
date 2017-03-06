# poengliga
Project for scraping stats from Poengliga

## Installation
Open project folder in a shell. Run "npm install" to install node packages.

## Running the app
Run "node statsFromGames". The application will run on port 8083. 
Open either localhost:8083/herrer or localhost:8083/damer in a browser.

The application will run for a while and return all stats where a 
player got 20 or more points in a game as a json. 
This can be modified by changing the number 19 in line 127 
and 139 in statsFromGames.js.