import { Keychain } from "./keys.js"; // import API keys
import { caCities } from "./ca-cities-json.js"; // import cities data

// create global vars for HTML Form
 const searchButton = document.getElementById("button");
 const searchField = document.getElementById("search");

// create global vars
 let list = document.getElementById("parkList");
 const caCitiesData = caCities;
 //for place info
 let placeElem = document.getElementById("placeName");
 var placeName = "Alamo";
 var placeLat = 37.85020000;
 var placeLon = -122.03218000;
 var place = {
    name: placeName,
    lat: placeLat,
    lon: placeLon,
    id: "ca111093",

    top: function(lat) {
        return lat + 0.202553;
    },
    left: function(lon) {
        return lon - 0.484093;
    },
    btm: function(lat) {
        return lat - 0.51;
    },
    right: function(lon) {
        return lon + 0.761822;
    }
 };

// check data matches for Alamo
//console.log("topLeft=38.066068,-122.457460&btmRight=37.353515,-121.211545");
//console.log("topLeft=", place.top(place.lat), ",", place.left(place.lon), "&btmRight=", place.btm(place.lat), ",", place.right(place.lon));

// init map
 let map = L.map("map").setView([place.lat, place.lon], 10);
 L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>",
    subdomains: "abcd",
    maxZoom: 20})
    .addTo(map);

    
// create layer group for all parks in place range
 let parksLayer = L.layerGroup([]).addTo(map);

// init You Are Here Marker
 let youreHereMarker = L.circleMarker([place.lat, place.lon], {
    opacity: .7,
    radius: 7,
    fillOpacity: .3
 })
    .on("move", function() {
        youreHereMarker.setPopupContent(`<h2>${place.name}</h2>`);
    })
    .addTo(map)
    .bindPopup(`<h2>${place.name}</h2>`)
 ;

document.addEventListener("DOMContentLoaded", init);

function init() {
    console.log(searchField, searchButton);

    // update placeholder & title text to match initial
     updateHTMLElem();
    
    // show parsed parks data points
     filterParks();

    //searchbar events
        // find place
         searchButton.addEventListener("click", search);
        // searchbar filtering while typing function:
         //searchField.addEventListener("input", searchInput);   
};

function searchInput(e) { // update recommended places list as user types
    // get search input
     let value = e.target.value;
    // check value
     console.log(value);
};

async function search(e) { // final search function; connector of all search asyncs
    try {
        // prevent page reload
        e.preventDefault();
        await removeParks();
        // CHANGE WHEN FINISH OTHER FUNCTIONS
        let results = await searchCities();
        //check results match place
        console.log("search f(x)", results, place);

        await filterParks();
        refreshWholeApp();

    } catch(err) {
        console.log("Search Error:", err);
    };
};

    async function removeParks() {
        // remove old park markers
        parksLayer.clearLayers();
        // check layer group actually cleared
        console.log("removed", parksLayer.getLayers());
        console.log("paths on page", document.getElementsByTagName("path"));

        // remove old park list items
        list.innerHTML = "";
        console.log("parks cleared");
    };

    function getSearch() { // get search input from searchbar
        // identify search input
        let value = searchField.value;
        return value;
    };

    async function searchCities() { // compare search input to cities data
        try {
            let newPlace = await getSearch();
            // for loop to scan through cities
            for (let i = 0; i < caCitiesData.length; i++) {
                // labeling for clarity; as if wrote "forEach((caCity) =>)"
                let caCity = caCitiesData[i];
                // specifying the city data object
                let cityData = caCity.city;
                // if search name matches the city name
                if(newPlace == cityData.name) {
                    // then replace old map place data with new place's data
                    place.name = cityData.name;
                    place.lat = Number(cityData.lat);
                    place.lon = Number(cityData.lon);
                    place.id = cityData.id;
                    // check new place's data
                    console.log("updated city", place);
                };
            };
            return place;
        } catch(err) {
            console.log("Search Cities Error:", err);
        };
    };

async function refreshMap() {
    // update map elem
     map.setView([place.lat, place.lon]);
    // update You Are Here Marker
     youreHereMarker.setLatLng([place.lat, place.lon]);
     youreHereMarker.update();
};

async function refreshWholeApp() {
    // update placeholder & title to match new place
     updateHTMLElem();
    // update map data
     refreshMap();
}

async function getParks() { // get tomtom parks data
    try {
        console.log("get parks with", place);
        let response = await fetch(`https://api.tomtom.com/search/2/poiSearch/dog+park.json?key=${Keychain.tom.pass}&limit=100&ofs=0&countryset=US&lat=${place.lat}&lon=${place.lon}&topLeft=${place.top(place.lat)},${place.left(place.lon)}&btmRight=${place.btm(place.lat)},${place.right(place.lon)}&language=en-US&categoryset=9362&relatedpois=all`);
        let baseData = await response.json();
        let data = baseData.results;
        return data;
    } catch(err) {
        console.log("Parks Fetch Error:", err);
    };
};


async function filterParks() {
    try {
        // get park data from getParks f(x)
        let fullList = await getParks();
        console.log("got all parks", fullList);
        // iterate through parks
        fullList.forEach((park) => {
            // filter to parks within limit range
            if(park.position.lon < place.right(place.lon)
                && park.position.lon > place.left(place.lon)) {
                if(park.position.lat > place.btm(place.lat)
                && park.position.lat < place.top(place.lat)) {
                    // create a Park object for each park
                     var parkContent = new Park(park.id, park.position.lat, park.position.lon, park.poi.name, park.address.freeformAddress);
                        // LIST ITEM for each park
                        // create list item
                         let newLI = new DocumentFragment;
                         let newListItem = document.createElement("LI");
                        // add identifier
                         newListItem.id = `p${parkContent.id}`;
                        // populate list item
                         newListItem.innerHTML = `<h1>${parkContent.name}</h1>
                            <p class="address">${parkContent.address}</p>
                            <a class="mapIt" target="_blank" href="https://www.google.com/maps/search/${parkContent.nameUrl}/@${parkContent.lat},${parkContent.lon}">Get Directions</a>`;
                        // append list item to list
                         newLI.appendChild(newListItem);
                         list.appendChild(newLI);

                        // create plot point for park
                         var parkMarker = L.circle(
                            [park.position.lat, park.position.lon], {
                                color: "rgba(230, 60, 60, .6)", // bright & semiopaque cherry red
                                radius: 5,
                                fillColor: "rgb(230, 60, 60)", // bright cherry red
                                fillOpacity: .7,
                         }).addTo(parksLayer)
                         // create pop-up with basic info -- for later: include link to html list item?
                          .bindPopup("<h1>" + park.poi.name + "</h1>" +
                                "<p>" + park.address.streetName + "<br>" +
                                park.address.municipality + ", " + park.address.countrySubdivision + " " + park.address.postalCode + "</p>"
                          )
                         ;
                };
            };
        });
        console.log("filtered parks", parksLayer.getLayers());
        console.log("paths on page", document.getElementsByTagName("path"));
    } catch(err) {
        console.log("Parks Filter Error:", err)
    };
};

function updateHTMLElem() {
    // update placeholder & title to match new place
     updatePlaceholder();
     updateTitle();
};

    function updatePlaceholder() {
        // change placeholder text to currently search place
         searchField.placeholder = place.name;
        //check placeholder
         console.log("placeholder", searchField.placeholder);
    };

    function updateTitle() {
        // update title span contents
         placeElem.innerHTML = `${place.name}`;
        // check title
         //console.log(placeElem.parentElement);
    };


// park constructor
function Park(id, lat, lon, name, address) {
    // info for server use
     this.id = "l" + id;
     this.lat = lat;
     this.lon = lon;
     this.nameUrl = name.replaceAll(" ", "+");

    // client-side info
     this.name = name;
     this.address = address;
     this.favorite = false;
};

// FOR ROAD GOAT
/*var roadOptions = {
    'method': 'GET',
    'hostname': 'api.roadgoat.com',
    'path': '/api/v2/destinations/new-york-ny-usa',
    'headers': {
      'Authorization': `Basic NDBlOGJlZDIxY2RjNGJiOWJmNWE2YzNmNmNmNzhjMjE6YTRlZjljNjdhYTU5N2UzZDE2ZjQ2NTljMDJjOTZjNDE=`
    },
    'maxRedirects': 20
};

var roadHeader = new Headers(roadOptions);*/


// FOR ROAD GOAT
/*async function getRoadInfo() {
    try {
        let response = await fetch("https://api.roadgoat.com/api/v2/destinations/new-york-ny-usa", { headers: roadHeader});
        console.log(response);
    } catch(err) {
        console.log("Road Fetch Error:", err)
    };
};*/

/*
fetch("https://api.roadgoat.com/api/v2/destinations/");*/

//fetch("dogpark.json")
/*fetch(`https://api.tomtom.com/search/2/poiSearch/dog+park.json?key=${Keychain.tom.pass}&limit=100&ofs=0&countryset=US&lat=${place.lat}&lon=${place.lon}&topLeft=${place.top(place.lat)},${place.left(place.lon)}&btmRight=${place.btm(place.lat)},${place.right(place.lon)}&language=en-US&categoryset=9362&relatedpois=all`)
    .then((response) => response.json())
    .then((baseData) => {
        let data = baseData.results;
        data.forEach((park) => {
            if(park.position.lon < place.right(place.lon)
                && park.position.lon > place.left(place.lon)) {
                if(park.position.lat > place.btm(place.lat)
                && park.position.lat < place.top(place.lat)) {
                    // create an object with the following attributes
                    var parkContent = new Park(park.id, park.position.lat, park.position.lon, park.poi.name, park.address.freeformAddress);
                    // create HTML elements
                    let newLI = new DocumentFragment;
                    let newListItem = document.createElement('LI');
                    newListItem.id = parkContent.id;
                    newListItem.innerHTML = `<h1>${parkContent.name}</h1>
                    <p class="address">${parkContent.address}</p>
                    <a class="mapIt" target="_blank" url="https://www.google.com/maps/search/${parkContent.nameUrl}/@${parkContent.lat},${parkContent.lon}">Get Directions</a>`;
                    // append HTML elements
                    newLI.appendChild(newListItem);
                    list.appendChild(newLI);

                    // create plot point for park
                    var parkMarker = L.circle([park.position.lat, park.position.lon], {
                        color: 'rgba(230, 60, 60, .6)',
                        radius: 12,
                        fillColor: 'rgb(230, 60, 60)'
                    }).addTo(map)
                    // create pop-up with basic info
                    .bindPopup("<h1>" + park.poi.name + "</h1>" +
                        "<p>" + park.address.streetName + "<br>" +
                        park.address.municipality + ", " + park.address.countrySubdivision + " " + park.address.postalCode + "</p>"
                    );
                };
            };
        });
    })
    .catch(err => console.log("LOCATION error:", err));
*/
