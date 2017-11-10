# JWT token utilities for Cisco Spark APIs

The `sparkjwt` command line interface (CLI) helps generate JWT user tokens based on an a 'organisation' and 'secret' you can retreive from [Cisco Spark for Developers portal](https://developer.ciscospark.com) (COMING).

This repo also contains two NodeJS scripts that how how JWT tokens can be generated and can be verified.


## CLI

To install the `sparkjwt` CLI, type:

    ```shell
    npm install sparkjwt -g
    ```


To create a JWT token for a user, type:

    ```shell
    SECRET=<secret> ORG=<org> sparkjwt -u <userId> -n <userName>
    ```

    Note that the `userId` is an organisation unique identifier for the user, in order to persist Spark data associated to the user

    The `userName` is used to identify the user in Cisco Spark spaces.


Then pass the JWT token to the POST request below in order to generate a Cisco Spark API access token for the user: 

    ```shell
    curl -X POST https://api.ciscospark.com/v1/jwt/login -H 'authorization: <jwttoken>'
    ```

    Note that the issued token will expire after 6 hours.
    You can test the temporarly issued access token is correct simply by reaching to the [GET /people/me](https://developer.ciscospark.com/endpoint-people-me-get.html) resource of the REST API.


## Scripts

To install the scripts, type 

    ```shell
    git clone https://github.com/ObjectIsAdvantag/spark-jwt-token
    cd spark-jwt-token
    npm install
    ```


### generate.js

To create a new JWT token, type:

    ```shell
    SECRET=<secret> node generate.js <organisation> <userId> <userName>
    ```


### verify.js

To check the contents of an existing token, type:

    ```shell
    SECRET=<secret> node verify.js <token>
    ```
