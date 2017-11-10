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

    var command = "sparkjwt";

    console.log(`Usage: SECRET=<secret> ORG=<org> ${command} -u <userId> -n <userName>\n`);
    console.log("Generates JWT user tokens based on an a 'organisation' and 'secret'");
    console.log("By default, starts the specified script in the context of a Tropo Inbound Voice call.\n");
    console.log("To test for an Outbound SMS call, try:\n   > " + command + " <your-script.js> --outbound --SMS \n");
    console.log('To pass parameters, try:\n   > ' + command + ' <your-script.js> --parameters "phonenumber=+33678007800" "msg=Hello world!"\n');
    console.log("Supported options:");
    console.log("   -h,--help                     : shows usage");
    console.log("   -n, --name 'John Doe'         : user name");
    console.log("   -o, --org 'DEV_ORG'           : developer organisation");
    console.log("   -s, --secret 'DEV_SECRET'     : developer secret");
    console.log("   -u, --uid '123456789'         : unique identifier of the user among the org");
    console.log("   -v,--version                  : shows version");
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