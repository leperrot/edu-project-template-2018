/**
 * Created by leperrot on 30/01/18.
 */
const frisby = require('frisby');
const Joi = frisby.Joi;

const URL = 'http://localhost:'+process.env.SERVER_PORT+'/api/episodes';

describe("1st", function(){

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



});