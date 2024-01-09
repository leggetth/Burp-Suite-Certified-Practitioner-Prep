# HTTP Host Header Attacks

## Testing:
- Check for flawed validation
  - Try using the port to see if it is being validated `Host: test.com:payload`
  - Try a url that ends the same, for example `test.com` and `payload.com`
  - Try a subdomains url
- Send ambiguous requests
  - Try duplicate host headers
  - Try with an absolute url and bad host header
   ```http
   GET https://vulnerable-website.com/ HTTP/1.1
   Host: bad-stuff-here
   ```
  -  Try indenting one of the duplicate host headers
-  Try override headers
  ```http
  X-Forwarded-Host
  X-Host
  X-Forwarded-Server
  X-HTTP-Host-Override
  Forwarded
  ```
  - param miner should test for these

## How to exploit each type:

1. Password reset poisoning
  - Intercept the request and modify the host header to a domain you control.
  - The victim then recieves a genuine reset email and clicks the link, which sends you their token.
  - You can then use this token on the site.
2. Web cache poisoning
  - Look for the Host header being reflected to access a js file
3. Server-side vulnerabilities
  - Check to see if the host header is being used for SQL
4. Auth Bypass
  - Change host header to localhost
5. SSRF
  - Routing-based
    - Attempt to use collaborator in the host header to see if you get interactions
    - Use intruder to fuzz ip subnets to see if one address gives a different response
  - Flawed request parsing
    - Similar to routing based see if an ip address give a different response
    - The main difference is that an absolute url was used
6. Connection state
  - For this attack you first need the address to the internal host or other host
  - Next, you need to send two requests to repeater:
    - The first is a normal request to the homepage with `Connection: keep-alive`.
    - The second uses a host header with the other hosts value


## Other important notes:
- Has to be tested manually
