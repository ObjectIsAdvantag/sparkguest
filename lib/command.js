/*
 * Copyright (c) 2017 Cisco
 * Released under the MIT license. See the file LICENSE
 * for the complete license
 */

const debug = require('debug')('sparkjwt')


//
// Check args
//

var commandLineArgs = require('command-line-args')

var optionDefinitions = [

    // user ID designed by the developer, it's a string of numbers and letters without space, it's different from Spark User ID
    { name: 'uid', alias: 'u', type: String },
    { name: 'name', alias: 'n', type: String },

    { name: 'organisation', alias: 'o', type: String },
    { name: 'secret', alias: 's', type: String },

    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean }
]

var args
try {
    args = commandLineArgs(optionDefinitions)
}
catch (err) {
    if (err.name === "UNKNOWN_OPTION") {
        console.log(err.message + "\n")
        help()
        process.exit(1)
    }
}

if (args.version) {
    var version = require('../package.json').version
    console.log(`v${version}`)
    process.exit(0)
}

if (args.help) {
    help()
    process.exit(0)
}

function help() {
    var command = "sparkjwt"

    console.log(`Usage: SECRET=<secret> ORG=<org> ${command} -u <userid> -n <username>\n`)
    console.log("Supported options:")
    console.log("   -h,--help                     : shows usage")
    console.log("   -n, --name 'John Doe'         : user name")
    console.log("   -o, --org 'DEV_ORG'           : developer organisation")
    console.log("   -s, --secret 'DEV_SECRET'     : developer secret")
    console.log("   -u, --uid '123456789'         : unique identifier of the user among the org")
    console.log("   -v,--version                  : shows version")
}

var org = process.env.ORG
if (args.organisation) {
    org = args.organisation
}
if (!org) {
    console.log("no organisation specified, add a ORG environment variable or use: -o <org>")
    process.exit(1)
}

var secret = process.env.SECRET
if (args.secret) {
    org = args.secret
}
if (!secret) {
    console.log("no secret specified, add a SECRET environment variable or use: -s <secret>")
    process.exit(1)
}

var uid = args.uid
if (!uid) {
    console.log("no user id specified, use: -u <userid>")
    process.exit(1)
}

var name = args.name
if (!name) {
    console.log("no user name specified, use: -n <username>")
    process.exit(1)
}

debug("arguments successfully checked")


//
// Build the JWT issuer token from the Guest user id and name
//

var issuerToken;
try {

    // sign with HMAC SHA256
    var jwt = require('jsonwebtoken')

    var payload = {
        "sub": uid,
        "name": name,
        "iss": org
    }

    var decoded = Buffer.from(secret, 'base64')

    issuerToken = jwt.sign(payload, decoded, { algorithm: 'HS256', noTimestamp: true })

    debug("successfully built issuer JWT token: " + issuerToken)
}
catch (err) {
    console.log("failed to generate a JWT issuer token: " + err.message)
    console.log("exiting...")
    process.exit(1);
}


//
// Generate a new access token for the Guest user
//

debug('contacting Cisco Spark API endpoint: https://api.ciscospark.com/v1/jwt/login')

const axios = require('axios');
axios.post('https://api.ciscospark.com/v1/jwt/login', '',
{ headers: { 'Authorization': issuerToken } })
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
