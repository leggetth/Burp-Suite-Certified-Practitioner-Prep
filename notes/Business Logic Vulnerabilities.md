# Business Logic Vulnerabilities

## Types:

1. Excessive trust in client-side controls
2. Failing to handle unconventional input
3. Making flawed assumptions about user behavior
4. Domain-specific flaws
5. Providing an encryption oracle

## How to find each type:

1. Excessive trust in client-side controls
- Tamper with data that you can not tamper with in the browser after it has been sent.
  - See if anything was changed on browser-side.
    - For example, the price has changed to the value.
3. Failing to handle unconventional input
4. Making flawed assumptions about user behavior
5. Domain-specific flaws
6. Providing an encryption oracle

## How to exploit each type:

1. Excessive trust in client-side controls
- Portswigger provides two labs showing examples of exploiting this:
  - Lab: Excessive trust in client-side controls
    - In this lab the exploit was to change the price in the `POST /cart` request.
      - The price was not changable in the UI, however you can edit it in Burp proxy.
  - Lab: 2FA broken logic
    - In this lab the exploit was to brute force the 4 digit mfa-code for the other user `carlos`.
    - The trust from client side was the the `verify=username` parameter was set client side, so you could brute force by just changing the username. 
3. Failing to handle unconventional input
4. Making flawed assumptions about user behavior
5. Domain-specific flaws
6. Providing an encryption oracle

## Other important notes:
- These vulnerabilities mainly arise from using the the app in ways that a developer would not intend.
  - For example editing the request through a proxy.
