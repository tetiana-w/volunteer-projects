'use strict';
/* The template, that hepls to create DOM Element quickly */
export default ({
    elementClasses = [],
    elementType = 'div',
    content = false,
    parentElement = false
}={}) => {
    let newElement = document.createElement(elementType);
       
    if (elementClasses.length > 0) newElement.className = elementClasses.join(' ');   
    if (content) newElement.innerHTML = content;
    if (parentElement) parentElement.appendChild(newElement); 
    return newElement;
}