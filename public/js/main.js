'use strict';

import createDOMElement from './create_dom_element.js';
import { openSidebar } from './sidebar.js';
import { convertMS } from './convert_ms.js';

//Open street map tile layer
let tileUrlOSM = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
let layerOSM = new L.TileLayer(tileUrlOSM, { maxZoom: 18 });

let map = new L.Map('mapid', {
    center: new L.LatLng(51.2296937, 8.4530592, 6),
    zoom: 6
});

// add 1 layer to the map
map.addLayer(layerOSM);

//socket
let timerBox = document.querySelector('#timer');

let socket = io();
let projectDate;

function createTimer(currentTime) {
    let timeLeftMlsc = new Date(projectDate).getTime() - new Date(currentTime).getTime();
    let timeLeft = convertMS(timeLeftMlsc);
    let daysLeft = timeLeft.day;
    let hoursLeft = timeLeft.hour;
    let minutesLeft = timeLeft.minute;
    let secondsLeft = timeLeft.seconds;

    if (projectDate && currentTime) {
        createDOMElement({
            elementType: 'div',
            content: `Noch ${daysLeft} Tage ${hoursLeft}:${minutesLeft}:${secondsLeft}`,
            parentElement: timerBox
        })
    }
}

socket.on('time', function (data) {
    timerBox.innerHTML = '';    
    createTimer(data.time);
});

//Get data from Database
const getDataDB = () => {
    fetch('/getdata').then(
        answer => answer.json()
    ).then(
        JSONdata => {            
            JSONdata.data.forEach(project => {   
                console.log(project.properties);             
                let projectProperties = project.properties;
                let latitude = project.geometry.coordinates[0];
                let longitude = project.geometry.coordinates[1];
                let projectName = project.properties.name;

                let projectMarker = L.marker([latitude, longitude]).addTo(map);
                projectMarker.bindTooltip(projectName, {
                    permanent: true,
                    direction: 'right'
                });

                projectMarker.addEventListener('click', el => {
                    openSidebar(projectProperties);
                    projectDate = projectProperties.date;
                });
            })
        }
    )
}

let projName = document.querySelector('#projname');
let projAdress = document.querySelector('#projadress');
let projResponsible = document.querySelector('#projresponsible');
let projMoney = document.querySelector('#projmoney');
let projInfo = document.querySelector('#projinfo');
let projdate = document.querySelector('#projdate'); //queryselector

//add new project in modal window
map.addEventListener('dblclick', function (el) {
    let coordinates = el.latlng;
    let latitude = coordinates.lat;
    let longitude = coordinates.lng;

    //Show modal
    let projectModal = document.querySelector('#createProjModal');
    projectModal.style.display = "block";

    //Close modal
    let closeBtnModal = document.querySelector('.close');
    closeBtnModal.addEventListener('click', () => {
        projectModal.style.display = "none";
        latitude = 500;
        longitude = 500;
    });

    //Save project
    let saveProjectBtn = document.querySelector('#saveproject');
    saveProjectBtn.addEventListener('click', el => {

        if (latitude !== 500 & longitude !== 500) {
            saveProject(latitude, longitude);
            el.preventDefault();
            projectModal.style.display = "none";
            latitude = 500;
            longitude = 500;
        }
    });

    //Clear input fields
    projName.value = '';
    projAdress.value = '';
    projResponsible.value = '';
    projMoney.value = '';
    projInfo.value = '';
    projdate.value = '';
});

function saveProject(latitude, longitude) {
    let saveProjectRequest = new Request(
        '/saveProject',
        {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                type: "Feature",
                properties: {
                    name: projName.value,
                    money_needed: projMoney.value,
                    money_donated: 0,
                    responsible: projResponsible.value,
                    description: projInfo.value,
                    adress: projAdress.value,
                    date: new Date(projdate.value)
                },
                geometry: {
                    type: "Point",
                    coordinates: [
                        latitude,
                        longitude
                    ]
                }
            })
        }
    )
    fetch(saveProjectRequest).then(
        answer => answer.json()
    ).then(
        //answer => console.log(answer)
        JSONdata => {
            JSONdata.data.forEach(el => {

                let feature = el.features;
                let latitude = feature.geometry.coordinates[0];
                let longitude = feature.geometry.coordinates[1];
                let projectName = feature.properties.name;

                let projectMarker = L.marker([latitude, longitude]).addTo(map);
                projectMarker.bindTooltip(projectName, {
                    permanent: true,
                    direction: 'right'
                });

                projectMarker.addEventListener('click', el => {
                    openSidebar(feature.properties);
                    projectDate = feature.properties.date;
                });
            })
        }
    ).catch(
        err => console.log(err)
    )
}

//Donate button
 let donateBtn = document.querySelector('#donatebtn');

donateBtn.addEventListener('click', donate);
function donate() {
    alert('This function is under construction :)');
} 

getDataDB();
