
const debug = require('debug')('sparkjwt:request')

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


function requestGuestToken(issuerToken) {
    debug("requesting new 'guest' token")
    
    debug('contacting Cisco Spark API endpoint: /jwt/login')
    
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
}