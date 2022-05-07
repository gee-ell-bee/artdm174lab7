import { Keychain } from "./keys.js"; // import API keys

/*let headers = new Headers();
headers.append("X-CSCAPI-KEY", "API_KEY");
let requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
};*/

let list = document.getElementById("parkList");
let place = {
    name: "New York",
    lat: 40.7142700,
    lon: -74.0059700,

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

const map = L.map("map").setView([place.lat, place.lon], 10);
L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>",
    subdomains: "abcd",
    maxZoom: 20})
    .addTo(map);

document.addEventListener("DOMContentLoaded", init);

function init() {
    // show parsed parks data points
    filterParks();
}

async function getParks() {
    try {
        const response = await fetch(`https://api.tomtom.com/search/2/poiSearch/dog+park.json?key=${Keychain.tom.pass}&limit=100&ofs=0&countryset=US&lat=${place.lat}&lon=${place.lon}&topLeft=${place.top(place.lat)},${place.left(place.lon)}&btmRight=${place.btm(place.lat)},${place.right(place.lon)}&language=en-US&categoryset=9362&relatedpois=all`);
        const baseData = await response.json();
        const data = baseData.results;
        return data;
    } catch(err) {
        console.log("Parks Fetch Error:", err)
    };
};

async function filterParks() {
    try {
        let fullList = await getParks();
        fullList.forEach((park) => {
            if(park.position.lon < place.right(place.lon)
                && park.position.lon > place.left(place.lon)) {
                if(park.position.lat > place.btm(place.lat)
                && park.position.lat < place.top(place.lat)) {
                    // create an object with the following attributes
                    var parkContent = new Location(park.id, park.position.lat, park.position.lon, park.poi.name, park.address.freeformAddress);
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
                    const dogPark = L.circle([park.position.lat, park.position.lon], {
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
    } catch(err) {
        console.log("Parks Filter Error:", err)
    };
};

function Location(id, lat, lon, name, address) {
    // computational IDs
    this.id = "l" + id;
    this.lat = lat;
    this.lon = lon;

    // client-side info
    this.name = name;
    this.address = address;
    this.favorite = false;
    this.nameUrl = name.replaceAll(" ", "+");
};

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
                    var parkContent = new Location(park.id, park.position.lat, park.position.lon, park.poi.name, park.address.freeformAddress);
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
                    var dogPark = L.circle([park.position.lat, park.position.lon], {
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
