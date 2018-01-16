var config = require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

app.use(bodyParser.json());

var episodes = express.Router();

episodes.post('/', function(request, response){
    let episode = request.body;
    if(episode) {
        episode.id = "firstEpisode";
        fs.writeFileSync(config.data+'/'+episode.id+'.json',JSON.stringify(episode), "UTF-8");
        response.sendStatus(201);
        response.send(episode);
    }
    else response.sendStatus(400);
});

episodes.get('/', function(request, response){
    let episodes = [];
    let data = {};
    fs.readdir(config.data, function(error, files){
        if(error){
            throw error;
        }
        files.forEach(function(file){
            data = JSON.parse(fs.readFileSync(config.data+'/'+file, "UTF-8"));
            console.log(data);
            episodes.push(data);
            console.log(episodes);
        });
    });
    response.send(episodes);
});

app.use('/api/episodes', episodes);

app.listen(config.port);