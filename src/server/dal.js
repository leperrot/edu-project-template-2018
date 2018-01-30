/**
 * Created by leperrot on 30/01/18.
 */
var fs = require('fs');
var config = require('./config.js');

exports.insert = function (episode){
    return new Promise((resolve, reject) => {
        fs.writeFile(config.data+'/'+episode.id+'.json',JSON.stringify(episode), "UTF-8", function(err){
            if (err) {
                reject(err);
                return;
            }
            resolve(episode);
        });
    });
};

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "UTF-8", function(err, data){
            if(err){
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

exports.find = function (id){
    let path = config.data + '/' + id + ".json";
    return readFile(path);
};

exports.findAll = function () {
    return new Promise((resolve, reject) => {
        fs.readdir(config.data, function(error, files){
            if(error) {
                reject(error);
                return;
            }
            let promises = [];
            files.forEach(function(file){
                promises.push(readFile(config.data+"/"+file));
            });
            Promise.all(promises)
                .then(values => {
                    resolve(values);
                })
                .catch(err => {
                    reject(err);
                });
        });
    });
};

exports.remove = function (id){
    return new Promise((resolve, reject) => {
        fs.unlink(config.data+'/'+id+'.json', function (error) {
            if (error) {
                reject(error);
                return;
            }
        });
        resolve();
    })
};
