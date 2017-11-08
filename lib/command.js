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

    // var command = "tropoready";
    // console.log("Usage: " + command + " [--script] <your-script.js>\n");
    // console.log("Simulates a Tropo runtime environment to quickly check for obvious inconsistencies (syntax error, wrong arguments).");
    // console.log("By default, starts the specified script in the context of a Tropo Inbound Voice call.\n");
    // console.log("To test for an Outbound SMS call, try:\n   > " + command + " <your-script.js> --outbound --SMS \n");
    // console.log('To pass parameters, try:\n   > ' + command + ' <your-script.js> --parameters "phonenumber=+33678007800" "msg=Hello world!"\n');
    // console.log("Supported options:");
    // console.log("   -c, --callerID '+33678007800' : sets the callerID for Inbound calls. Ignored if the call is Outbound");
    // console.log("   --checkOptions                : if true, verifies that the script 'Choice Options' pattern are well-formed");
    // console.log("   -h,--help                     : shows usage");
    // console.log("   --initialText                 : set the specified initial text. Ignored if the call is not on a SMS channel");
    // console.log("   -o, --outbound                : starts the script in the context of an outbound call");
    // console.log("   -p, --parameters              : injects variables parameters, example: -p 'phonenumber=+33678007800'");
    // console.log("   -r, --request                 : dumps the HTTP client library. Paste it on top of your Tropo script");
    // console.log("   -s, --SMS                     : marks the call as a text channel, whether inbound or outbound");
    // console.log("   [--script] filename.js        : specify the script to start. Note that the '--script' mention is optional");
    // console.log("   -v,--version                  : shows version");
}

var org = process.env.ORG;
if (args.organisation) {
    org = args.organisation;
}
if (!org) {
    console.log("no organisation specified, add a ORG environment variable or use: -o <org>");
    process.exit(0);
}

var uid = args.uid;
if (!uid) {
    console.log("no user id specified, use: -u <userid>");
    process.exit(0);
}

var name = args.name;
if (!name) {
    console.log("no user name specified, use: -n <username>");
    process.exit(0);
}

var secret = process.env.SECRET;
if (args.secret) {
    org = args.secret;
}
if (!secret) {
    console.log("no secret specified, add a ORG environment variable or use: -o <org>");
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