"use strict";

// https://api.harvardartmuseums.org/object?apikey=48f5fbf5-4e39-4108-a9ee-fb768134935b&classification=Paintings|Prints

//vars
const API_KEY = "?apikey=48f5fbf5-4e39-4108-a9ee-fb768134935b";
const API_URL_POSTS = 'https://api.harvardartmuseums.org/object';
//let PARAMS = "&hasimage=1";
const body = document.querySelector("body");
const postContainer = document.querySelector("#posts .container .row");

//filter
const classificationFilter = document.querySelector("#classification-filter");
const mediumFilter = document.querySelector("#medium-filter");

const loadmoreButton = document.querySelector("#loadmore");
const totalResultsContainer = document.querySelector("#totalResults");
const numberOfPages = document.querySelector("#item-pages");
const currentPageContainer = document.querySelector("#current-page");

const siteSearch = document.querySelector("#site-search");

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


let type;
let currentPage = 1;

//get - set query filter helper function
var queryStringObject = {
    hasimage: 1,
    //medium: "Terracotta",
    classification: "Albums",
    page: 1,
    size: 12,
    //&q=title:20,
    //q: "horseman",
};


var queryString = JSON.stringify(queryStringObject);
queryString = "&" +queryString.replaceAll(':', '=').replaceAll(',', '&').replaceAll('"', '').slice(1, -1);
console.log(queryString)

/*
* eventListener for classification
*/
classificationFilter.addEventListener("change", () => {

    type = "classification";
    queryStringObject["medium"] = "any";

    queryStringObject["classification"] = classificationFilter.value;

    var queryString = JSON.stringify(queryStringObject);
    queryString = "&" +queryString.replaceAll(':', '=').replaceAll(',', '&').replaceAll('"', '').slice(1, -1);

    fetchPosts(type, queryString, currentPage);
});

/*
* eventListener for medium
*/
mediumFilter.addEventListener("change", () => {

    type = "medium";

    queryStringObject["medium"] = mediumFilter.value;
    queryStringObject["classification"] = "any";

    var queryString = JSON.stringify(queryStringObject);
    queryString = "&" +queryString.replaceAll(':', '=').replaceAll(',', '&').replaceAll('"', '').slice(1, -1);

    fetchPosts(type, queryString, currentPage);
});


/*
* loading animation
*/
let loader = (status) =>{

    if(status == true){

        body.classList.add("loading");
      
        let loadingContainer = document.createElement('div');
        loadingContainer.className = 'loadingContainer';

        body.appendChild(loadingContainer);

        let loader = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
        
        loadingContainer.innerHTML = loader;

    }

    if(status == false){

        body.classList.remove("loading");
       
        let loadingContainer = document.querySelector(".loadingContainer");
        loadingContainer.parentNode.removeChild(loadingContainer);

    }

}


/*
* fetch posts
*/

let html = '';
//only render pageNumber 1 time
let pageFlag = 0;

let fetchPosts = async (type, queryString, currentPage) => {

    loader(true);

    if(type == "classification" || "loadmore"){
         html = '';
    }

    if(type == "classification"){
        pageFlag = 0;
        currentPage = 1;
   }

   if(type == "medium"){
    pageFlag = 0;
    currentPage = 1;
    }
   
    fetch(API_URL_POSTS + API_KEY + queryString, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {

        loader(false);
        
        let posts = data.records;

         console.log(posts.length);
        console.log(data); 
        
        totalResultsContainer.innerHTML = `items: ${data.info.totalrecords}`;
        
        currentPageContainer.innerHTML = `${currentPage} / `;
        
        if(pageFlag == 0){
            numberOfPages.innerHTML = `${data.info.pages}`;
        }
        
        posts.forEach(element => {

            html += `<div class="item col-md-3 mb-4 d-flex align-self-top flex-wrap">`;
            html += `<div class="image">`;
            html += `<img src="${element.primaryimageurl}" />`;
            html += `</div>`;
            html += `<div class="title my-4">${element.title}</div>`;
            html += `</div>`;

           /*  var iDiv = document.createElement('div');
            iDiv.className = 'col-md-3 mb-4';
            iDiv.innerHTML = `<img src="${element.primaryimageurl}" />`;
            postContainer.appendChild(iDiv); */
            
        });


    postContainer.innerHTML = html;

    pageFlag = 1;
       
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

fetchPosts(type, queryString, currentPage);



/*
* eventListener for loadmoreButton
*/

loadmoreButton.addEventListener("click", (e) => {

    e.preventDefault();

    type = "loadmore";

    console.log(currentPage, parseInt(numberOfPages.innerHTML))

    if(currentPage < numberOfPages.innerHTML){

        queryStringObject["size"] = queryStringObject["size"] + 12;

        var queryString = JSON.stringify(queryStringObject);
        queryString = "&" + queryString.replaceAll(':', '=').replaceAll(',', '&').replaceAll('"', '').slice(1, -1);

        currentPage++;

        fetchPosts(type, queryString, currentPage);

    } 
  
});


/*
* eventListener for siteSearch
*/
siteSearch.addEventListener("submit", (e) => {

    e.preventDefault();

    type = "search";

    delete queryStringObject.classification;

    queryStringObject["q"] = document.querySelector("#seachInput").value;

    var queryString = JSON.stringify(queryStringObject);
    queryString = "&" + queryString.replaceAll(':', '=').replaceAll(',', '&').replaceAll('"', '').slice(1, -1);

    fetchPosts(type, queryString, currentPage);
});
