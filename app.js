'use strict';

//Express
const express = require('express');
let app = express();
app.use(express.static('public'));

// http
const http = require('http');
let httpServer = http.Server(app);

//Websocket
const socketIO = require('socket.io')(httpServer);
function sendTime() {
    socketIO.emit('time', { time: new Date() })
}

setInterval(sendTime, 500);

//Database
const nano = require('nano')('http://localhost:5984'); 
let projectsDB = nano.db.use('projects');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Get all projects from database
app.get('/getdata', (req, res) => {
    projectsDB.view('projectsDesignDoc', 'projects-view').then(
        answer => {
            console.log(answer);
            answer = answer.rows.map(row => {                
                return {
                    id: row.id,
                    properties: row.value.properties,
                    geometry: row.value.geometry
                }
            })

            res.send(JSON.stringify({
                status: 'ok',
                data: answer
            }))
        }
    ).catch(
        err => {
            console.log(err);
            res.send(JSON.stringify({
                status: 'err'
            }))
        }
    )
})

//Add new project to database
app.post('/saveProject', (req, res) => {
   
   // console.log(req.body);
    projectsDB.insert({
        type: 'FeatureCollection',
        name: 'points',
        crs: {
            type: "name",
            properties: { name: "urn:ogc:def:crs:EPSG::4326" }
        },
        feature: req.body,
        test: 'test'
    }).then(
        () => projectsDB.view('all_projects', 'proj')
    ).then(
        answer => {
            
            //console.log(answer);
            answer = answer.rows.map(row => {
                return {
                    id: row.id,
                    crs: row.value.crs,
                    features: row.value.features
                }
            })

            res.send(JSON.stringify({
                status: 'ok',
                data: answer
            }))
        }

    ).catch(
        err => {
            console.log(err);
            res.send(
                JSON.stringify({ status: 'err' })
            )
        }
    )

})

let server = httpServer.listen(80, err => { 
    let port = server.address().port;
    if (err) console.log(err);
    else console.log(`Listening at: ${port}`);
});
