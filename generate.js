/*
 * Copyright (c) 2017 Cisco
 * Released under the MIT license. See the file LICENSE
 * for the complete license
 */

var jwt = require('jsonwebtoken');

// base64 encoded secret
var secret = process.env.SECRET;
if (!secret) {
    var secret = "ZG8gbm90IHNoYXJl";
    console.log(`no secret specified, using ${secret}`);
}
var decoded = Buffer.from(secret, 'base64')

// organisation
var org = process.argv[2];
if (!org) {
    var org = "Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi8yYTllMTNlOC0xYWM3LTQxOGEtOTcxMy0zYWQzYzk5MWIxYjU";
    console.log(`no org specified, using ${org}`);
}

// user id
var uid = process.argv[3];
if (!uid) {
    var uid = "1234567890";
    console.log(`no org specified, using ${uid}`);
}

// username
var username = process.argv[4];
if (!username) {
    var username = "John Doe";
    console.log(`no org specified, using ${org}`);
}

var payload = {
    "sub": uid,
    "name": username,
    "iss": org
}

var token = jwt.sign(payload, decoded, { algorithm: 'HS256', noTimestamp: true });

console.log(token);
