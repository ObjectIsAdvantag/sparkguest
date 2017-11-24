# JWT token utilities for Cisco Spark APIs

The `sparkjwt` command line interface (CLI) helps generate JWT user tokens based on an a 'organisation' and 'secret' you can retreive from [Cisco Spark for Developers portal](https://developer.ciscospark.com) (COMING).


To install the `sparkjwt` CLI, type:

    ```shell
    npm install sparkjwt -g
    ```


To create a JWT token for a user, type:

    ```shell
    SECRET=<secret> ORG=<org> sparkjwt -u <userId> -n <userName>
    ```

    where:
        - the `userId` is an identifier unique to the developer org. This identifier is used to persist Spark data among the user interactions inside Cisco Spark,
        - the `userName` is used to identify the user in Cisco Spark spaces
        - the issued token will expire after 6 hours

    Example:

    ```shell
    DEBUG=sparkjwt SECRET=<dev-secret> ORG=<dev-org> bin/sparkjwt -u "123" -n "Stève"
        sparkjwt arguments successfully checked +0ms
        sparkjwt successfully built issuer JWT token: BDmh0rgbcVMfpklnyWfurxX5Y... +59ms
    eyJhbGciOiJSUzI1NiJ9.GltZXN0YW1...wIjDcyWiJ9.T8u3zZ4h...vDrPsvIQ2EA7w
        sparkjwt contacting Cisco Spark API endpoint: https://api.ciscospark.com/v1/jwt/login +2ms
    
    eyJhbGciOiJSUzI1NiJ9.eyJtYWN...uNDU1WiJ9.berce_d8vrRw6vDI....nMAlnYNj-f921mcqU
    ```

To test the issued access tokens for a user, reach to the [GET /people/me](https://developer.ciscospark.com/endpoint-people-me-get.html) resource of the Cisco Spark REST API, paste the issued token and examine the response to identify the user display name. 

    Example of Person details for an issued access token:

    _Note that the person type is `bot` and the email is formed from `<user_id>@<decoded-org>`_

    ```json
    {
        "id": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS84ZGNjMzQxYS1hNDJhLTQ5YzgtODAzMS02OTY1NWM4MGI3Njc",
        "emails": [
            "123@2a9e13e8-1ac7-418a-9713-3ad3c991b1b5"
        ],
        "displayName": "Stève",
        "avatar": "https://00792fd90955bc2b54b7-dde9bcd8a491bb35da928cc2123a400b.ssl.cf1.rackcdn.com/default_machine~80",
        "orgId": "Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi8yYTllMTNlOC0xYWM3LTQxOGEtOTcxMy0zYWQzYzk5MWIxYjU",
        "created": "2017-11-24T17:12:29.500Z",
        "type": "bot"
    }
    ```


## Implementation details

A JWT issuer token is first generated for the user (id/name) of the developer org.

Then the JWT issuer token is passed via a POST request in order to generate a Cisco Spark API access token for the guest user: 

    ```shell
    curl -X POST https://api.ciscospark.com/v1/jwt/login -H 'authorization: <jwt-issuer-token>'
    ```
