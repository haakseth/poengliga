var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var iconv   = require('iconv'); 

function statSorter(a,b){
  if(b.totalt !== a.totalt){
    return b.totalt - a.totalt;
  }
  if(b.angrep !== a.angrep){
    return b.angrep - a.angrep;
  }
  if(b.serve !== a.serve){
    return b.serve - a.serve;
  }
  if(b.blokk !== a.blokk){
    return b.blokk - a.blokk;
  }
  return 0;
  
}
function scrapeStats(baseUrl, fileName, callback){
  var urls = [];
  for (var i = 0; i < 100; i++) {
    console.log(baseUrl + i + "web.html");
    urls.push(
      {
        url: baseUrl + "/0607/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/0708/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/0809/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/0910/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/1011/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/1112/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/1213/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/1314/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/1415/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/1516/kamper/" + i + "web.html",
        id: i
      }
    );
    urls.push(
      {
        url: baseUrl + "/1617/kamper/" + i + "web.html",
        id: i
      }
    );
  }
  var json = {
    statistikker: []
  }
  function scraper(count){
    if(count < urls.length){
      request({url: urls[count].url, encoding: null}, function(error, response, html){
        console.log(urls[count].url);
        var length = "";
        if(!error){
          var ic = new iconv.Iconv('iso-8859-1', 'utf-8');
          var convHtml = ic.convert(html);
          var $ = cheerio.load(convHtml);
          var rows = $("tr");
          if(rows.length >0){
            var lagARows = rows[3].childNodes;
            var lagBRows = rows[4].childNodes;
            var turnering = "";
            var dato = "";
            if(rows[1].childNodes.length == 2){
              turnering = $(rows[1].childNodes[0]).text();
              dato = $(rows[1].childNodes[1]).text();
            }else{
              turnering = $(rows[1]).text();
            }
            var kampInfo = {
              turnering:  turnering.substr(15),
              dato:       dato,
              url:        urls[count].url,
              motstandere: $(lagARows[1]).text() + " - " + $(lagBRows[1]).text(),
              resultat:   $(lagARows[2]).text() + "-" + $(lagBRows[2]).text()
            };
            for (var i = 8; i < 26; i++) {
              if(($(rows[i].childNodes[4]).text() !== "") && parseInt($(rows[i].childNodes[3]).text()) > 19){
                json.statistikker.push({
                  navn: $(rows[i].childNodes[4]).text(),
                  klubb: $(lagARows[1]).text(),
                  draktNr: i-7,
                  serve: parseInt($(rows[i].childNodes[0]).text()),
                  angrep: parseInt($(rows[i].childNodes[1]).text()),
                  blokk: parseInt($(rows[i].childNodes[2]).text()),
                  totalt: parseInt($(rows[i].childNodes[3]).text()),
                  kampInfo: kampInfo
                });
              }
              if($(rows[i].childNodes[6]).text() !== "" && parseInt($(rows[i].childNodes[10]).text()) > 19){
                json.statistikker.push({
                  navn: $(rows[i].childNodes[6]).text(),
                  klubb: $(lagBRows[1]).text(),
                  draktNr: i-7,
                  serve: parseInt($(rows[i].childNodes[7]).text()),
                  angrep: parseInt($(rows[i].childNodes[8]).text()),
                  blokk: parseInt($(rows[i].childNodes[9]).text()),
                  totalt: parseInt($(rows[i].childNodes[10]).text()),
                  kampInfo: kampInfo
                });
              }
            }
          }

          scraper(count+1);
        }
        
      })
    }else{
      json.statistikker = json.statistikker.sort(statSorter);
      fs.writeFile(fileName, JSON.stringify(json, null, 4), function(err){
        console.log('File written! ' + fileName);
      })
      callback(json);
    } 
  }
  scraper(0);
}

app.get('/herrer/', function(req, res){
  var baseUrl = 'http://www.poengliga.no/eliteh';
  scrapeStats(baseUrl, 'herrer_flat.json', function(json){
    res.send(json);
  });
})

app.get('/damer/', function(req, res){
  var baseUrl = 'http://www.poengliga.no/elited';
  scrapeStats(baseUrl, 'damer_flat.json', function(json){
    res.send(json);
  });
})

app.listen('8083')
console.log('Open localhost:8083/damer or localhost:8083/herrer in a browser.');
exports = module.exports = app;