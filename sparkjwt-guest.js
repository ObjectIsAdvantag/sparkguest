//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

const debug = require('debug')('sparkjwt:guest')

const program = require('commander')

program
    .description('generates an API access token for the specified "Guest" user and developer "Organization"\n\
note that:\n\
  - the organisation can be passed either via an ORG env variable, or the -o option\n\
  - the secret can be passed either via a SECRET env variable, or the -s option')
    .option('-o, --organization [org]', 'developer organization')
    .option('-s, --secret [secret]', 'secret for the developer organization')
    .arguments('<userid> <username>')
    .action(function (userid, username) {

        // Check org & secret
        let org = program.organization || process.env.ORG
        let secret = program.secret || process.env.secret
        if (!org) {
            console.error('missing organization identifier, exiting...')
            console.error('please specify either via an ORG env variable, or the -o option')
            process.exit(1)
        }
        if (!secret) {
            console.error('missing organization secret, exiting...')
            console.error('please specify either via a SECRET env variable, or the -s option')
            process.exit(1)
        }
        debug('successfully collected organization details')

        // Check user info
        if (typeof userid === 'undefined') {
            console.error('no userid specified, exiting...');
            process.exit(1);
        }
        if (typeof username === 'undefined') {
            console.error('no full name specified of "Guest" user, exiting...');
            process.exit(1);
        }
        debug('successfully collected guest user info')

        // Forge issuer token
        const JWTUtil = require('./sparkjwt-util')        
        const issuerToken = JWTUtil.createJWTIssuer(org, secret, userid, username)

        // Request access token
        JWTUtil.requestGuestToken(issuerToken)

    })
    .on('--help', function () {
        console.log('')
        console.log('  Examples:')
        console.log('')
        console.log('    $ sparkjwt guest 123456789 "John Doe" -o "org_id" -s "secret"')
        console.log('    $ ORG="org_id" SECRET="secret" sparkjwt gest 123456789 "John Doe"')
    })

program.parse(process.argv)
