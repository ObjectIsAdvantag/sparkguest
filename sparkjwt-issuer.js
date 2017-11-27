#!/usr/bin/env node

const debug = require('debug')('sparkjwt:issuer')

const program = require('commander')

program
    .description('creates a reusable JWT "issuer" token for the specified "Guest" user of the developer organization\n\
  note that:\n\
    - the developer organization can be passed either via an ORG env variable, or the -o option\n\
    - the secret of the organization can be passed either via a SECRET env variable, or the -s option')
    .option('-o, --organization [org]', 'developer organisation')
    .option('-s, --secret [secret]', 'developer secret')
    .arguments('<userid> <username>')
    .action(function (id, name) {
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
        if (typeof id === 'undefined') {
            console.error('no identifier specified for "Guest" user, exiting...');
            process.exit(1);
        }
        if (typeof name === 'undefined') {
            console.error('no full name specified of "Guest" user, exiting...');
            process.exit(1);
        }
        debug('successfully collected guest user info')
        
        createJWTIssuer(org, secret, id, name)
    })
    .on('--help', function () {
        console.log('')
        console.log('  Examples:')
        console.log('')
        console.log('    $ sparkjwt issuer 123456789 "John Doe" -o "org_id" -s "secret"')
        console.log('    $ ORG="org_id" SECRET="secret" sparkjwt issuer 123456789 "John Doe"')
    })

program.parse(process.argv)


function createJWTIssuer(org, secret, userid, username) {
    debug(`generating JWT issuer token for guest user with id: ${userid}, name: ${username}, in dev org: ${org}`)

    console.log("not implemented")    
}