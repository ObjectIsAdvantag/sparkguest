# CLI to generate JWT tokens for Cisco Spark 'Guest Issuer' Applications

'Guest Issuer' Applications allow guests (non Cisco Spark users) to persistently use the Cisco Spark platform through the Spark Sdks and Widgets. Check the [online documentation for details](https://developer.ciscospark.com/guest-issuer.html).

The `sparkjwt` command line interface (CLI) helps generate JWT tokens for 'Guest Issuer' Applications.

To use the tool, you'll first need to create a 'Guest Issuer' application from [Spark for Developers portal](https://developer.ciscospark.com/add-guest.html), and fetch your 'Guest Issuer' Application's organisation id and secret.
**Note that you need a paying account to access the 'Guest Issuer' application.**


## QuickStart

To install the `sparkjwt` CLI, type:

    ```shell
    npm install sparkjwt -g
    ```

To create an access token for a 'Guest' user (non Cisco Spark users), type:

    ```shell
    sparkjwt [guest] <userId> <userName> -o <organisation> -s <secret>
    ```

    Where:
        - the `userId` is a user identifier unique to your 'Guest Issuer' application. This identifier is used by Cisco Spark to persist user among sessions. Understand: if another token gets generated with the same 'userId', the guest user interacting with that token will see Spaces, Messages, and inherit Memberships from previous spark interactions for this 'userId',
        - the `userName` is used to identify the user in Cisco Spark spaces,
        - the issued access token expires after 6 hours and is formatted as a JWT token (see below for more info, and the `check` command)
        

    Example (with verbose debugging info):

    ```shell
    DEBUG=sparkjwt*  sparkjwt guest "123" "Stève" -o <dev-org> -s <dev-secret>
        sparkjwt arguments successfully checked +0ms
        sparkjwt successfully built issuer JWT token: BDmh0rgbcVMfpklnyWfurxX5Y... +59ms
        sparkjwt contacting Cisco Spark API endpoint: https://api.ciscospark.com/v1/jwt/login +2ms
    eyJhbGciOiJSUzI1NiJ9.eyJtYWN...uNDU1WiJ9.berce_d8vrRw6vDI....nMAlnYNj-f921mcqU
    ```

    Note that:
        - instead of passing them through command line parameters, you can alternatively specify the organisation identifier or secret via `ORG` and `SECRET` environment variables
        - the `guest` command is the default's for sparkjwt. You can omit it as in `sparkjwt  "123" "Stève" -o <dev-org> -s <dev-secret>`


## Implementation notes

First, a **JWT Guest issuer** token is forged from the user data (user id, user name) and the developer organization info (org id, org secret).

Then the JWT issu**er** token is passed as a Header of a POST request to the /jwt/login endpoint in order to generate a Cisco Spark API access token for the guest user (JWT issu**ed** token): 

    ```shell
    curl -X POST https://api.ciscospark.com/v1/jwt/login -H 'authorization: <jwt-issuer-token>'
    ```


### JWT issuer token

This token is used to generate access tokens for a Guest user.

This token is build from a user's data (user id and user name) and the details of the developer org (org id and secret).

**Example of JWT issuer token created via the sparkjwt CLI**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiU3TDqHZlIiwiaXNzIjoiWTJselkyOXpjR0Z5YXpvdkwzVnpMMDlTUjBGT1NWcEJWRWxQVGk4eVlUbGxNVE5sT0MweFlXTTNMVFF4T0dFdE9UY3hNeTB6WVdRell6azVNV0l4WWpVIn0.VZkUYLuA1ROFkbOEgEBDnh0rpklnyWfY
```

Note that the issued token also has a JWT format.
If you decode it, you'll discover its contents.
Go to https://jwt.io, or simply type: `sparkjwt verify --jwt <token>`

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
  "iss": "Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi8yYTllMTNlOC0xYWM3LTQxOGEtOTcxMy0zYWQzYzk5MWIxYjU"
}
```

### JWT issued token

This token is generated from a JWT issuer token.

This token gives access to the Cisco Spark API under the 'Guest' user identity (associated to the JWT issuer token)

To test the issued access tokens for a user, reach to the [GET /people/me](https://developer.ciscospark.com/endpoint-people-me-get.html) resource of the Cisco Spark REST API, paste the issued token and examine the response to identify the user display name.
Alternatively, you can simply type: `sparkjwt verify --spark <token>`

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