var config = require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require("node-uuid");
var fs = require('fs');

var app = express();

app.use(bodyParser.json());

var episodes = express.Router();

episodes.post('/', function(request, response){
    let episode = request.body;
    if(episode) {
        episode.id = uuid.v4();
        fs.writeFile(config.data+'/'+episode.id+'.json',JSON.stringify(episode), "UTF-8", function(err){
            if (err) throw err;
        });
        response.send(episode);
    }
    else response.sendStatus(400);
});

episodes.get('/:id', function(request, response){
    let episode = {};
    let id = request.params.id;

    fs.readFile(config.data+'/'+id+".json", "UTF-8", function(err, data){
        if(err){
            response.sendStatus(404);
        }
        episode = data;
        response.send(episode);
    });
});

episodes.get('/', function(request, response){
    let episodes = [];
    fs.readdir(config.data, function(error, files){
        if(error){
            throw error;
        }
        files.forEach(function(file){
            fs.readFile(config.data+'/'+file, "UTF-8", function(err, data){
                if (err) {
                    throw err;
                }
                episodes.push(JSON.parse(data));
            });
        });
    });
    response.send(episodes);
});

episodes.put('/:id', function(request, response){
    let episode = request.body;
    if(episode){
        fs.writeFile(config.data+'/'+episode.id+'.json', JSON.stringify(episode), "UTF-8", function(err){
            if (err) throw err;
        });
        response.send(episode);
    }else {
        response.sendStatus(400);
    }
});

episodes.delete('/:id', function(request, response){
    let id = request.params.id;
    if(id){
        fs.unlink(config.data+'/'+id+'.json', function (error) {
            if (error) {
                response.sendStatus(404);
                return;
            }
        });
        response.sendStatus(200);
    }else{
        response.sendStatus(400);
    }
});

app.use('/api/episodes', episodes);

app.listen(config.port);