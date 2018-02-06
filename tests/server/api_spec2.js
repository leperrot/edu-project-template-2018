/**
 * Created by leperrot on 30/01/18.
 */
const frisby = require('frisby');
var fs = require('fs');
const Joi = frisby.Joi;
var config = require('/home/etud/leperrot/edu-project-template-2018/src/server/config.js');

const URL = 'http://localhost:'+process.env.SERVER_PORT+'/api/episodes';

function createFakeEp() {
    let episode = {
        name:"Sherlock",code:"S01E01",note:"9.8",id:"9bade1e5-617d-4407-9a60-7a9912a24b0c"
    };
    fs.writeFile(config.data+"/"+episode.id+'.json',JSON.stringify(episode), "UTF-8", function(err){
        if(err){
            return;
        }
    });
    return episode;
}

describe("1st", function(){

    afterAll(function(){
        fs.readdir(config.data, function(error, files){
            if(error) {
                console.log(error);
                return;
            }
            files.forEach(function(file){
                fs.unlink(config.data + "/" + file, function (error) {
                    if(error)
                        console.log(error);
                });
            });
        });
    });

    it("should retrieve all the episodes", function(){
        frisby
            .get(URL+'/')
            .expect('status', 200);
    });

    it("should create an episode", function(){
        frisby
            .post(URL+'/', {
                name: "Utopia",
                code: "S01E01",
                note : "8.0"
            }, {json: true})
            .expect('status', 200)
            .expect('jsonTypes', {
                id: Joi.string().required()
            });
    });

    describe("2nd", function () {

        let episode;

        beforeEach(function () {
            episode = createFakeEp();
        });

        it("should get an episode", function(){
            frisby
                .get(URL+'/'+episode.id)
                .expect("status", 200)
                .expect("json", "name", "Sherlock")
        });

        it("should modify an episode", function(){
            frisby
                .put(URL+'/'+episode.id, {
                    name:"Sherlock",
                    code:"S01E01",
                    note:"10",
                    id:episode.id
                })
                .expect("status", 200)
                .expect("json", "note", "10")
        });

        it("should delete the episode", function () {
            frisby
                .del(URL+'/'+episode.id)
                .expect("status", 200)
        });
    });
});