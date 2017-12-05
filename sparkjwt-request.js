//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

const debug = require('debug')('sparkjwt:request')

const program = require('commander')

program
    .description('asks Cisco Spark for a new API access token.\n\
  note that:\n\
    - the "Guest" identity is inferred from the specified "issuer" token\n\
    - the returned token is only valid for 6 hours')
    .arguments('<issuer-token>')
    .action(function (issuerToken) {
        // Check issuer token is present       
        if (!issuerToken) {
            console.error('missing issuer token, exiting...')
            console.error("you can generate an issuer token with command: 'sparkjwt issuer'")
            process.exit(1)
        }
        debug('successfully collected issuer token')

         // Request access token
         const JWTUtil = require('./sparkjwt-util')
         JWTUtil.requestGuestToken(issuerToken)
    })
    .on('--help', function () {
        console.log('')
        console.log('  Example:')
        console.log('')
        console.log('    $ sparkjwt request "12tre33.54343275.5456456745"')
    });

program.parse(process.argv)
