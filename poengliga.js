var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

function scrapeStats(baseUrl, fileName, callback){
  var urls = [];
  for (var i = 300; i >= 0; i--) {
    urls.push(
      {
        url: baseUrl + i,
        id: i
      }
    );
  }
  var json = {
    players: []
  }
  function scraper(count){
    if(count < urls.length){
      request(urls[count].url, function(error, response, html){
        if(!error){
          var $ = cheerio.load(html);
  
          var player = { 
            playerInfo: {},
            stats : []
          };
  
          var rows = $('tr');
          var playerDetailRow = rows[2];
          var playerDetailsNodes = $(playerDetailRow).children()[1].childNodes;
          var imageUrl = $($(playerDetailRow).children()[0].childNodes[1]).attr('src');
          if(playerDetailsNodes[2].data !== "  "){
            player.playerInfo.id          = urls[count].id;
            player.playerInfo.name        = playerDetailsNodes[2].data;
            player.playerInfo.imageUrl    = "http://poengliga.no/" + imageUrl;            
            player.playerInfo.shirtNr     = playerDetailsNodes[6].data;
            player.playerInfo.height      = playerDetailsNodes[10].data;
            player.playerInfo.birthdate   = playerDetailsNodes[14].data;
            player.playerInfo.position    = playerDetailsNodes[18].data;
            player.playerInfo.teamName    = playerDetailsNodes[22].data;
            player.playerInfo.reach       = playerDetailsNodes[26].data;
            player.playerInfo.block       = playerDetailsNodes[30].data;
            player.playerInfo.nation      = playerDetailsNodes[34].data;
            player.playerInfo.intMatches  = playerDetailsNodes[38].data;
            console.log(player.playerInfo.name);
            for(var i = 0; i < rows.length; i++){
              var row = rows[i];
              var rowNodes = $(row).children();
              if(rowNodes.length === 7 && 
                $(rowNodes[0]).text() !== "Matchnr" &&
                $(rowNodes[0]).text() !== ""){
                player.stats.push({
                  matchnr:      $(rowNodes[0]).text(),
                  matchTeams:   $(rowNodes[1]).text(),
                  result:       $(rowNodes[2]).text(),
                  serve:        $(rowNodes[3]).text(),
                  attack:       $(rowNodes[4]).text(),
                  block:        $(rowNodes[5]).text(),
                  total:        $(rowNodes[6]).text()
                });
              }
            }
            json.players.push(player);
          }
          
          scraper(count+1);
        }else{
          console.log("error");
          scraper(count+1);
        }
        
      })
    }else{
      fs.writeFile(fileName, JSON.stringify(json, null, 4), function(err){
        console.log('File written! ' + fileName);
      })
      callback(json);
    } 
  }
  scraper(0);
}

app.get('/herrer/', function(req, res){
  var baseUrl = 'http://poengliga.no/pl_player_show_detail.php?id=';
  scrapeStats(baseUrl, 'players_herrer.json', function(json){
    res.send(json);
  });
})

app.get('/damer/', function(req, res){
  var baseUrl = 'http://poengliga.no/pl_player_show_detail_w.php?id=';
  scrapeStats(baseUrl, 'players_damer.json', function(json){
    res.send(json);
  });
})

app.listen('8081')
console.log('Open localhost:8081/damer or localhost:8081/herrer in a browser.');
exports = module.exports = app;