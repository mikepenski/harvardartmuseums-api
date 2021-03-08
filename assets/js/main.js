"use strict";

// https://api.harvardartmuseums.org/object?apikey=48f5fbf5-4e39-4108-a9ee-fb768134935b&classification=Paintings|Prints

//vars
const API_KEY = "?apikey=48f5fbf5-4e39-4108-a9ee-fb768134935b";
const API_URL_POSTS = 'https://api.harvardartmuseums.org/object';
//let PARAMS = "&hasimage=1";
const body = document.querySelector("body");
const postContainer = document.querySelector("#posts .container .row");

let classificationFilter = document.querySelector("#classification-filter");

var queryStringObject = {
    classification: "Paintings|Prints",
    //hasimage: 1,
    //page: 1,
    size: 10,
};


classificationFilter.addEventListener("change", () => {

    queryStringObject["classification"] = classificationFilter.value;

    console.log(queryStringObject)

    var queryString = JSON.stringify(queryStringObject);
    queryString = "&" +queryString.replaceAll(':', '=').replaceAll(',', '&').replaceAll('"', '').slice(1, -1);

    fetchPosts(queryString);
});


var queryString = JSON.stringify(queryStringObject);
queryString = "&" +queryString.replaceAll(':', '=').replaceAll(',', '&').replaceAll('"', '').slice(1, -1);

console.log(queryString)

/*
* adding padding to body (header height)
*/
function resizeContent(){
    const header = document.querySelector("header")
    let header_height = header.offsetHeight;

    body.style.paddingTop = header_height + "px";

}
resizeContent();

window.onresize = resizeContent;


let html = '';

let fetchPosts = (queryString) => {
   
    fetch(API_URL_POSTS + API_KEY + queryString, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        
        let posts = data.records;

        console.log(posts)

        postContainer.innerHTML = "";
        
        posts.forEach(element => {

            html += `<div class="col-md-3 mb-4">`;
            html += `<img src="${element.primaryimageurl}" />`;
            html += `</div>`;

           

            // Your existing code unmodified...
            var iDiv = document.createElement('div');
            iDiv.className = 'col-md-3 mb-4';
            iDiv.innerHTML = `<img src="${element.primaryimageurl}" />`;
            postContainer.appendChild(iDiv);
            
        });

       
    //postContainer.innerHTML = " ";
    //postContainer.innerHTML = html;

       
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

fetchPosts(queryString);

