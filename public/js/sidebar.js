'use strict';

import createDOMElement from './create_dom_element.js';

//Open sidebar
export function openSidebar(featureProperties) {
    document.getElementById('sidebarMap').style.width = '400px';
    createProjectInfo(featureProperties);
}

//Close sidebar
let closeBtnSidebar = document.querySelector('#sidebarMap>.closebtn');
closeBtnSidebar.addEventListener('click', closeSidebar);

function closeSidebar() {
    document.getElementById('sidebarMap').style.width = '0';
}

//Info about project in the sidebar
function createProjectInfo(featureProperties) {
    let infoprodject = document.querySelector('#infoproject');

    infoprodject.innerHTML = "";
    createProjectTitle();
    createResponsible();
    createAdress();
    createMoneyBox();
    createDescription();
    createDateInfo();

    //The title of the project will be created in the sidebar
    function createProjectTitle() {
        createDOMElement({
            elementClasses: ['proj-title'],
            elementType: 'h2',
            content: featureProperties.name,
            parentElement: infoprodject
        })
    }
    //The responsible person / organization of the project will be created in the sidebar
    function createResponsible() {
        createDOMElement({
            content: `<b>Verantwortlich :</b>   ${featureProperties.responsible}`,
            parentElement: infoprodject
        })
    }
    //The adress of the project will be created in the sidebar
    function createAdress() {
        createDOMElement({
            content: `<b>Adresse :</b>   ${featureProperties.adress}`,
            parentElement: infoprodject
        })
    }
    //The information about "Donations target" and "Donated money" will be created in the sidebar
    function createMoneyBox() {
        createDOMElement({
            elementClasses: ['money-box'],
            parentElement: infoprodject
        })
        createDOMElement({
            content: `<p>Spendenziel</p> ${featureProperties.money_needed}€`,
            parentElement: document.querySelector('.money-box'),
        })
        createDOMElement({
            content: `<p>Bereits gespendet</p> ${featureProperties.money_donated}€`,
            parentElement: document.querySelector('.money-box'),
        })
    }
    //The description of the project will be created in the sidebar
    function createDescription() {
        createDOMElement({
            elementType: 'p',
            elementClasses: ['proj-description'],
            content: featureProperties.description,
            parentElement: infoprodject
        })
    }
    function createDateInfo() {
        createDOMElement({
            elementType: 'div',
            content: `Spenden möglich bis ${new Date(featureProperties.date).toLocaleDateString()}`,
            parentElement: infoprodject
        })
    }
}

