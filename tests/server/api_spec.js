const frisby = require('frisby');

const URL = 'http://localhost:'+process.env.SERVER_PORT+'/api/episodes';

getEmpty = frisby.create('GET all episodes')
    .get(URL+'/')
    .expectStatus(200)
    .after(function() {
        frisby.create('POST an episode')
            .post(URL+'/', {
                name: "Utopia",
                code: "S01E01",
                note : "8.0"
            }, {json: true})
            .expectStatus(200)
            .expectJSONTypes({
                id: String
            })
            .afterJSON(function(episode) {
                frisby.create('Get an episode')
                    .get(URL+'/'+episode.id)
                    .expectStatus(200)
                    .expectJSONTypes({
                        name: String,
                        code: String,
                        note: String,
                        id: String
                    })
                    .expectJSON({
                        name: "Utopia",
                        code: "S01E01",
                        note: "8.0",
                        id: episode.id
                    })
                    .afterJSON(function(episode) {
                        frisby.create('Delete an episode')
                            .delete(URL+'/'+episode.id)
                            .expectStatus(200)
                            .toss();
                    })
                    .toss();
                frisby.create('Get an unknow episode')
                    .get(URL+'/aaaa')
                    .expectStatus(404)
                    .toss();
            }).toss();
    }).toss();
