# CLI to generate Guest tokens for Cisco Spark 'Guest Issuer' Applications

'Guest Issuer' Applications allow guests (non Cisco Spark users) to persistently use the Cisco Spark platform through the Spark SDKs and Widgets. Check the [online documentation for details](https://developer.ciscospark.com/guest-issuer.html).

The `sparkguest` command line interface (CLI) helps generate Guest tokens for 'Guest Issuer' applications.

To use the tool, you'll first need to create a 'Guest Issuer' application from [Spark for Developers portal](https://developer.ciscospark.com/add-guest.html), and fetch your 'Guest Issuer' Application's organisation id and secret.
**Note that you need a paying account to access the 'Guest Issuer' application.**


## QuickStart

To generate a Guest token, type the commands below in a terminal

```shell
# Install the CLI
npm install sparkguest -g

# Create a Guest token with the specified user info
sparkguest create <userId> <userName> -i <issuerAppId> -s <issuerAppSecret> [-d <expirationDate>]

# Fetch an access token for the Guest user (valid for 6 hours)
sparkguest login <guestToken>
```


You can even get there quicker with the `quick` command:

```shell
# Install the CLI
npm install sparkguest -g

# Create a Guest token, and fetch an access token right away
# Here, the guest token is volatile (neither stored, not returned)
sparkguest quick <userId> <userName> -i <issuerAppId> -s <issuerAppSecret>
```



## Detailled instructions

To install the `sparkguest` CLI, type:

    ```shell
    npm install sparkguest -g
    ```


To create a 'Guest token' for a 'Guest' user (non Cisco Spark users), type:

    ```shell
    sparkguest [create] <userId> <userName> -i <issuerAppId> -s <issuerAppSecret> [-e <expirationDate>]
    ```

    Where:
        - `userId` is a user identifier unique to your 'Guest Issuer'. This identifier is used by Cisco Spark to persist user data among sessions. Understand: if another token gets generated with the same 'userId', the Guest user interacting with that token will see Spaces, Messages, and inherit Memberships from previous Spark interactions for this 'userId',
        - `userName` is used to identify the user in Cisco Spark spaces,
        - `expirationDate` is a date formatted as a number of seconds. Defaults to 90 minutes after the command is invoked,
        - the `issuerAppId` and `issuerAppSecret` tie to the 'Guest Issuer Application' created frpm the [Spark for Developers portal](https://developer.ciscospark.com/add-guest.html).
    
    Example (with verbose debugging info):

    ```shell
    DEBUG=guest*  sparkguest create "123" "Stève" -i Y2lz...VzLMDY -s AMx/FPI...NABzD6o=
        guest arguments successfully checked +0ms
        guest successfully built Guest token: BDmh0rgbcVMfpklnyWfurxX5Y... +59ms
        guest Guest token is valid till XXXXX +1ms        
    eyJhbGciOiJSUzI1NiJ9.eyJtYWN...uNDU1WiJ9.berce_d8vrRw6vDI....nMAlnYNj-f921mcqU
    ```

    Note that:
        - instead of passing them through command line parameters, you can alternatively specify the 'Guest Issuer Application'  identifier and secret via environment variables `ISSUER` and `SECRET` 
        - the `create` command is the default's for sparkguest. You can omit it as in `sparkguest "123" "Stève" -i Y2lz...VzLMDY -s AMx/FPI...NABzD6o=`
        

Once you've got a 'Guest token', you'll need to fetch an access token (valid for 6 hours).

    ```shell
    sparkguest login <guestToken>
    ```

    Note that:
       - the command uses the Cisco Spark API 's /jwt/login endpoint behind the scene.
       - the fetched accessed token is valid for 6 hours


To quickly check the data contained in a JWT token (guest or access token), you can type:

    ```shell
    sparkguest verify --jwt <token>
    ```


To quickly the Person behind an access token (equivalent of a GET /people/me), type

    ```shell
    sparkguest verify --spark <access_token>
    ```


### Guest tokens

Guest tokens have a JWT format, and are signed with your 'Guest Issuer Application' secret so that Cisco Spark can be assured of its origin.
It contains an expiration date so that Cisco Spark will refuse to generate access tokens - via the /jwt/login endpoint - after the expiration date.

**Example of JWT issuer token created via the sparkjwt CLI**

```
DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD
```

Note that the issued token also has a JWT format.
If you decode it, you'll discover its contents.
Go to https://jwt.io to decode it, or simply type: `sparkguest decode <guest token>`

**Decoded Header Section**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Decoded Data section**

```json
{
  "sub": "123",
  "name": "Stève",
  "iss": "Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi8yYTllMTNlOC0xYWM3LTQxOGEtOTcxMy0zYWQzYzk5MWIxYjU",
  "exp": "XXXXX"
}
```


### Access tokens (issued from Guest tokens )

These tokens are generated from a Guest token by invoking the /jwt/login endpoint
They give access to the Cisco Spark API, SDKs and Widgets under the identity of the Guest user.

To test the issued access tokens for a user, reach to the [GET /people/me](https://developer.ciscospark.com/endpoint-people-me-get.html) resource of the Cisco Spark REST API, paste the issued token and examine the response to identify the user display name.
Alternatively, you can simply type: `sparkguest whois <access token>`

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

Note that the issued token also has a JWT format.
If you decode it, you'll discover its structure.
Go to https://jwt.io, or simply type: `sparkjwt verify --jwt <token>`


**Decoded Header Section**

```json
{
  "alg": "RS256"
}
```

**Decoded Data section**

```json
{
  "machine_type": "robot",
  "expiry_time": 1511565148879,
  "user_type": "machine",
  "realm": "2a9e13e8-1ac7-418a-9713-3ad3c991b1b5",
  "cis_uuid": "8dcc341a-a42a-49c8-8031-69655c80b767",
  "reference_id": "b4f77f99-bbae-411e-a058-2204f3daac88",
  "iss": "https://idbroker.webex.com/idb",
  "token_type": "Bearer",
  "client_id": "C3117723a0a4c985a8bd6dda76f7766c51324b6f41bf4fef1c2c82784a1f2975c",
  "token_id": "AaZ3r0YWE4NjExZDktYTIxNS00ZWNmLWIyZWQtZmU0YzIxYzliZGE0NDNiOGRiYzctMmI1",
  "private": "eyJhbGciOiJkaXIiLCJjdHkiOiJKV1QiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..qa1xdfMXt9Jfc5zcveshSg.wlPhO7F4oWJiRpnia-FNRW8xT4miENLphkxiz5w5j-XdfdR3RczcE8wg3g_W7zNnDPkMTLf_toc2IrgncgihFPcwgFkQcUDGo6tAUNDS5yCQ0JudZ-5zAcYeXPLiwGaRlUmuM5MXBc_K6_TNtFuOEuy1lO0SuQuZ4FPpUrDXOdaHdmzmAuRYBvKlNXc-dhgI7t4Kqv6ELG3M60eisBiJJ53AGY9KgV3qge3RipLj-Tv3CFroNCdd1x5FZu967g9BP91ujFEbaviM5DG_umf9NgOcpgtEGfm2WU7GAN_nezkv-zuU05p9Tens9N1ojdfotVHzfo5VobvOC9FwSN1hqJvYoPk9JeFpOJJS8K1Pwc4tM8RVJrSZm3pHp4SJ4gZJVWBK7w-P3tn_e3ulcNMKoTX0T474W5fLpwJkDHbWYBWKw3OziGqXJ4ECSZFQT8rrj2csDT9yhZjRg8U2jg0Xu6YaAjFUN85ivPNFQ-pWzFq6hP41EMLptPLOkuApcrv0QCZojBesD1hEkxMnJkBtil98ogyChoYYVCcSnRZhjinI9tC0FGBci7UQMwd6mSsEQefaBTLxAsQQ4YcMOa311BTXJDhARKNOxgM56tJM5LI.eKGLEOteVPgIATx45V0-PA",
  "user_modify_timestamp": "20171124171229.695Z"
}
```