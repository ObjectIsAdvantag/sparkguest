//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

const debug = require('debug')('sparkjwt:util')

//
// Builds a JWT issuer token from a Guest user id and name
//
module.exports.createJWTIssuer = function (org, secret, userid, username) {
    debug(`generating JWT issuer token for guest user with id: ${userid}, name: ${username}, in dev org: ${org}`)

    try {

        // sign with HMAC SHA256
        const jwt = require('jsonwebtoken')

        const payload = {
            "sub": userid,
            "name": username,
            "iss": org
        }

        const decoded = Buffer.from(secret, 'base64')

        const issuerToken = jwt.sign(payload, decoded, { algorithm: 'HS256', noTimestamp: true })

        debug("successfully built issuer JWT token" + issuerToken.substring(0,50))

        return issuerToken
    }
    catch (err) {
        console.error("failed to generate a JWT issuer token, exiting...");
        debug("err: " + err)
        process.exit(1)
    }
}


//
// Request an access token for the specified Guest User's Issuer Token
//
module.exports.requestGuestToken = function (issuerToken) {
    debug("requesting new 'guest' token")
    
    debug('contacting Cisco Spark API endpoint: /jwt/login')
    
    const axios = require('axios');
    axios.post('https://api.ciscospark.com/v1/jwt/login', '',
    { headers: { 'Authorization': 'Bearer ' + issuerToken } })
    .then(response => {
        if (!response.data || !response.data.token) {
            debug("no token found in response: " + response)
            console.log("failed to generate a JWT issuer token: bad response")
            console.log("exiting...")
            process.exit(1)
        }
    
        let issuedToken = response.data.token
        console.log(issuedToken)
    })
    .catch(err => {
        switch (err.code) {
            case 'ENOTFOUND':
                debug("could not contact Cisco Spark API")
                break
            default:
                debug("error accessing /jwt/login, err: " + err.message)
                break
        }
        
        console.log("failed to generate an access token")
        console.log("exiting...")
        process.exit(1);
    })   
}