let headers = new Headers();
headers.append("X-CSCAPI-KEY", "API_KEY");
let requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
};

const container = document.getElementById("container");


const map = L.map("map").setView([37.863515, -121.973367], 10);
L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>",
    subdomains: "abcd",
    maxZoom: 20})
    .addTo(map);

var circle = L.circle([51.508, -0.11], {
        color: 'red',
        radius: 0
    }).addTo(map);

/*async function combineData(art, country) {
    

}*/

fetch("https://api.tomtom.com/search/2/poiSearch/dog+park.json?key=w0Ntsu0zxW281gaO8nyj33OXcfgQDqbA&limit=100&ofs=0&countryset=US&lat=37.863515&lon=-121.973367&language=en-US&categoryset=9362&relatedpois=all")
    .then((response) => response.json())
    .then((pageData) => {
        console.log(pageData);
        console.log(pageData[0])
        for(let i = 0; i < pageData.length; i++) {
            Location();
        };
    })
    .catch(err => console.log("LOCATION error:", err));

// DATA SOURCE https://countrystatecity.in/
fetch("countries.json", requestOptions)
    .then((response) => response.json())
    .then((result) => {
        console.log("loaded countries data");

    })
    .catch(error => console.log("COUNTRY error:", error));

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
        };
        if(this.favorite = true) {
            this.favorite = false;
        }
    };
}