let headers = new Headers();
headers.append("X-CSCAPI-KEY", "API_KEY");
let requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow"
};

const container = document.getElementById("container");


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
        let data = pageData.results;
        data.forEach((park) => {
            //if the park is in the (general) (East?) Bay Area, put it on the map
            // find park's latitude & longitude
            if(park.position.lon < -119
            && park.position.lon > -123.039705) {
                if(park.position.lat > 37.138776
                && park.position.lat < 38) {
                    // create an object with the following attributes
                    // (for later reference)
                    Location(park.id, park.position.lat, park.position.lon, park.poi.name, park.address.freeformAddress);
                    // create plot point for park
                    var dogPark = L.circle([park.position.lat, park.position.lon], {
                        color: 'rgba(230, 60, 60, .6)',
                        radius: 0
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