/*
 * Copyright (c) 2017 Cisco
 * Released under the MIT license. See the file LICENSE
 * for the complete license
 */

var jwt = require('jsonwebtoken');

var secret = process.env.SECRET;
if (!secret) {
    var secret = "ZG8gbm90IHNoYXJl";
    console.log(`no secret specified, using ${secret}`);
}

var token = process.argv[2];
if (!token) {
    var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoiWTJselkyOXpjR0Z5YXpvdkwzVnpMMDlTUjBGT1NWcEJWRWxQVGk4eVlUbGxNVE5sT0MweFlXTTNMVFF4T0dFdE9UY3hNeTB6WVdRell6azVNV0l4WWpVIn0.7NcObotrtzCL01u_dZYN0N4IJXEhU8b8pgOBcuhaPq4";    ;
    console.log(`no token specified, using ${token}`);
}

try {
    var decoded = Buffer.from(secret, 'base64')
    var result = jwt.verify(token, decoded, { algorithm: 'HS256' });
    console.log(result);
}
catch (err) {
    console.log(err.message);
}


