
/*
 * Copyright (c) 2017 Cisco
 * Released under the MIT license. See the file LICENSE
 * for the complete license
 */

var commandLineArgs = require('command-line-args')

var optionDefinitions = [

    // user ID designed by the developer, it's a string of numbers and letters without space, it's different from Spark User ID
    { name: 'uid', alias: 'u', type: String },
    { name: 'name', alias: 'n', type: String },

    { name: 'organisation', alias: 'o', type: String },
    { name: 'secret', alias: 's', type: String },

    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean }
];

var args;
try {
    args = commandLineArgs(optionDefinitions)
}
catch (err) {
    if (err.name === "UNKNOWN_OPTION") {
        console.log(err.message + "\n");
        help();
        process.exit(1);
    }
}

if (args.version) {
    var version = require('./package.json').version;
    console.log(`v${version}`);
    process.exit(0);
}

if (args.help) {
    help();
    process.exit(0);
}

function help() {
    console("TODO: not implemented yet");
}

var org = process.env.ORG;
if (args.organisation) {
    org = args.organisation;
}
if (!org) {
    console.log("no organisation specified, exiting...");
    process.exit(0);
}

var secret = process.env.SECRET;
if (args.secret) {
    org = args.secret;
}
if (!secret) {
    console.log("no secret specified, exiting...");
    process.exit(0);
}

var uid = args.uid;
if (!uid) {
    console.log("no user id specified, exiting...");
    process.exit(0);
}

var name = args.name;
if (!name) {
    console.log("no user name specified, exiting...");
    process.exit(0);
}


try {

    // sign with HMAC SHA256
    var jwt = require('jsonwebtoken');

    var payload = {
        "sub": uid,
        "name": name,
        "iss": org
    }

    var decoded = Buffer.from(secret, 'base64')

    //
    var token = jwt.sign(payload, decoded, { algorithm: 'HS256', noTimestamp: true });

    console.log(token);

}
catch (err) {

    console.log(err.message);
    process.exit(1);
}