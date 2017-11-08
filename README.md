# JWT token utilities for Cisco Spark guest mode

The spark-jwt-token is a CLI that generate JWT tokens based on the guest mode 'organisation' and 'secret' you can retreive from [Cisco Spark for Developers portal](https://developer.ciscospark.com).

This repo also contains two scripts to experience how JWT tokens are generated and can be verified.


## spark-jwt-token

To install, type:

    ```shell
    npm install spark-jwt-token -g
    ```

To generate a JWT token, type:

    ```shell
    SECRET=<secret> ORG=<org> spark-jwt-token -u <userid> -n <username>
    ```

To generate a Cisco Spark API access token, type:



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
    SECRET=<secret> node generate.js <organisation> <userid> <username>
    ```


### verify.js

To check the contents of an existing token, type:

    ```shell
    SECRET=<secret> node verify.js <token>
    ```
