'use strict';

//Create Express server 
const express = require('express');
let app = express();
app.use(express.static('public'));

//Create http server
const http = require('http');
let httpServer = http.Server(app);

//Websocket. Sends current time to the client with an 
//interval in 500 millisec.
const socketIO = require('socket.io')(httpServer);
function sendTime() {
    socketIO.emit('time', { time: new Date() })
}

setInterval(sendTime, 500);

//Database connection
const nano = require('nano')('http://localhost:5984');
let projectsDB = nano.db.use('projects');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Get all projects from database
app.get('/getdata', (req, res) => {
    projectsDB.view('projectsDesignDoc', 'projects-view').then(
        answer => {
            /* console.log(answer); */
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
    projectsDB.insert({
        features: req.body,
        test: 'test'
    }).then(
        () => projectsDB.view('projectsDesignDoc', 'projects-view')
    ).then(
        answer => {
            console.log("ANSWER");
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
