let headers = new Headers();
headers.append("X-CSCAPI-KEY", "API_KEY");
let requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
};

const container = document.getElementById("container");
let list = document.getElementById("parkList");

const map = L.map("map").setView([37.703515, -121.973367], 8);
L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>",
    subdomains: "abcd",
    maxZoom: 20})
    .addTo(map);



//fetch("dogpark.json")
fetch("https://api.tomtom.com/search/2/poiSearch/dog+park.json?key=w0Ntsu0zxW281gaO8nyj33OXcfgQDqbA&limit=100&ofs=0&countryset=US&lat=37.863515&lon=-121.973367&radius=&topLeft=38.066068,-122.457460&btmRight=37.353515,-121.211545&language=en-US&categoryset=9362&relatedpois=all")
    .then((response) => response.json())
    .then((pageData) => {
        console.log(pageData.results);
        let data = pageData.results;
        data.forEach((park) => {
            //topLeft=38.066068,-122.457460&btmRight=37.353515,-121.211545
            if(park.position.lon < -119
                && park.position.lon > -123.039705) {
                if(park.position.lat > 37.138776
<<<<<<< HEAD
                    && park.position.lat < 38) {
=======
                && park.position.lat < 38) {
                    // create an object with the following attributes
                    // (for later reference)
                    var parkContent = new Location(park.id, park.position.lat, park.position.lon, park.poi.name, park.address.freeformAddress);
                    console.log(parkContent);
                    let newLI = new DocumentFragment;
                    let newListItem = document.createElement('LI');
                    newListItem.id = parkContent.id;
                    newListItem.innerHTML = `<h1>${parkContent.name}</h1>
                    <p class="address">${parkContent.address}</p>
                    <a class="mapIt" target="_blank" url="http://www.google.com/maps/search/${parkContent.nameUrl}/@${parkContent.lat},${parkContent.lon}">Get Directions</a>`;
                    newLI.appendChild(newListItem);
                    list.appendChild(newLI);
                    // create plot point for park
>>>>>>> 1dfd9e6 (html list of parks & accompanying placement css)
                    var dogPark = L.circle([park.position.lat, park.position.lon], {
                        color: 'rgba(230, 60, 60, .6)',
                        radius: 0
                    }).addTo(map);
                    Location(park.id, park.position.lat, park.position.lon, park.poi.name, park.address.freeformAddress);
                };
            };
        });
    })
    .catch(err => console.log("LOCATION error:", err));

function Location(id, lat, lon, name, address) {
    // computational IDs
    this.id = "l" + id;
    this.lat = lat;
    this.lon = lon;

    // client-side info
    this.name = name;
    this.address = address;
    this.favorite = false;
    this.favoritePark = function() {
        if(this.favorite = false) {
            this.favorite = true;
        } else if(this.favorite = true) {
            this.favorite = false;
        };
    };
    this.nameUrl = name.replaceAll(" ", "+");
};