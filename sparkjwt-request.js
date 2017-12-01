
const debug = require('debug')('sparkjwt:guest')

const program = require('commander')

program
    .description('asks Cisco Spark for a new API access token.\n\
  note that:\n\
    - the "Guest" identity is inferred from the specified "issuer" token\n\
    - the returned token is only valid for 6 hours')
    .arguments('<issuer-token>')
    .action(function (token) {
        // Check issuer token is present       
        if (!token) {
            console.error('missing issuer token, exiting...')
            console.error("you can generate an issuer token with command: 'sparkjwt issuer'")
            process.exit(1)
        }
        debug('successfully collected issuer token')

        requestGuestToken(token)
    })
    .on('--help', function () {
        console.log('')
        console.log('  Example:')
        console.log('')
        console.log('    $ sparkjwt request "12tre33.54343275.5456456745"')
    });

program.parse(process.argv)


function requestGuestToken(token) {
    debug("requesting new 'guest' token")

    console.log("not implemented")    
}