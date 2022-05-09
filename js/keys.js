export const Keychain = {
    // APIs & associated keys
    tom: new Keys(null, "w0Ntsu0zxW281gaO8nyj33OXcfgQDqbA"),
    //road: new Keys("0c16915f63a0abc852319a41ef180535", "acba3994d3a8c6a52a7dd12361b606f7")      
};

// constructor for new keys
function Keys(user, pass) {
    this.user = user;
    this.pass = pass;
    this.basicAuth = function(u, p) {
        return btoa(u, ":", p);
    };
};