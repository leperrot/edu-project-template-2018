var config = require('./config.js');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require("node-uuid");
var fs = require('fs');

const dal = require('./dal.js');

var app = express();

app.use(bodyParser.json());

var episodes = express.Router();

episodes.post('/', function(request, response){
    let episode = request.body;
    if(episode) {
        episode.id = uuid.v4();
        dal.insert(episode)
            .then((res) => {
                response.send(episode);
            })
            .catch((err) => {
                response.sendStatus(400);
            });
    }
    else response.sendStatus(400);
});

episodes.get('/:id', function(request, response){
    let episode = {};
    let id = request.params.id;
    dal.find(id)
        .then((data) => {
            response.send(data);
        })
        .catch((err) => {
            response.sendStatus(404);
        });
});

episodes.get('/', function(request, response){
    let episodes = [];
    dal.findAll()
        .then((data) => {
            response.send(data);
        })
        .catch((err) => {
            response.sendStatus(400);
        });
});

episodes.put('/:id', function(request, response){
    let episode = request.body;
    if(episode){
        dal.insert(episode)
            .then((episode) => {
                response.send(episode);
            })
            .catch((err) => {
                response.sendStatus(400);
            });
    }else {
        response.sendStatus(400);
    }
});

episodes.delete('/:id', function(request, response){
    let id = request.params.id;
    if(id){
        dal.remove(id)
            .then(() => {
                response.sendStatus(200);
            })
            .catch((err) => {
                response.sendStatus(404);
            });
    }else{
        response.sendStatus(400);
    }
});

app.use('/api/episodes', episodes);

app.listen(config.port);