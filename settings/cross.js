"use strict";

var crossDomain = function(){
    return function(req, res, next){
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin || '*');
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        
        req.headers['content-type'] = req.headers['content-type'] || 'application/json';
        next();
    };
}

module.exports = crossDomain; 
