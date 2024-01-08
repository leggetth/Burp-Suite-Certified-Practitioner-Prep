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
2. Failing to handle unconventional input
- To find this portswigger recommends to answer these questions:
  - Are there any limits that are imposed on the data?
  - What happens when you reach those limits?
  - Is any transformation or normalization being performed on your input?
3. Making flawed assumptions about user behavior
- Three subtypes:
  - Trusted users won't always remain trustworthy
    - See if any endpoints lack controls. 
  - Users won't always supply mandatory input
    -  Only remove one parameter at a time to ensure all relevant code paths are reached.
    -  Try deleting the name of the parameter as well as the value. The server will typically handle both cases differently.
    -  Follow multi-stage processes through to completion. Sometimes tampering with a parameter in one step will have an effect on another step further along in the workflow.
  - Users won't always follow the intended sequence
    - See if you can perform actions out of order.
4. Domain-specific flaws
5. Providing an encryption oracle

## How to exploit each type:

1. Excessive trust in client-side controls
- Portswigger provides two labs showing examples of exploiting this:
  - Lab: Excessive trust in client-side controls
    - In this lab the exploit was to change the price in the `POST /cart` request.
      - The price was not changable in the UI, however you can edit it in Burp proxy.
  - Lab: 2FA broken logic
    - In this lab the exploit was to brute force the 4 digit mfa-code for the other user `carlos`.
    - The trust from client side was the the `verify=username` parameter was set client side, so you could brute force by just changing the username. 
2. Failing to handle unconventional input
- Portswigger provides three labs showing examples of exploiting this:
  - High-level logic vulnerability
    - The exploit was to use a negative quantity of one product to purchase another.
  - Low-level logic flaw
    - The exploit was to use null payloads to reach the max int value for price causing it to loop to between 0 and 100.
  - Inconsistent handling of exceptional input
    - The exploit was to use the truncation mechanism so that the registered email ended in the employee domain:
      - `very-long-string@dontwannacry.com.YOUR-EMAIL-ID.web-security-academy.net`
3. Making flawed assumptions about user behavior
- Three subtypes:
  - Trusted users won't always remain trustworthy
    - Lab: Inconsistent security controls
      - After registering with any email, you could just change the email to an employee email without the need for verification.
  - Users won't always supply mandatory input
    -  Lab: Weak isolation on dual-use endpoint
      - You could change passwords without supplying the current one.
    -  Lab: Password reset broken logic
      - The temp forgot password token was not required.
  - Users won't always follow the intended sequence
    - Lab: 2FA simple bypass
      - The mfa code was not required, you could just change the url to `/my-account`
    - Lab: Insufficient workflow validation
      - If you added something to the cart, you could just send the `GET /cart/order-confirmation?order-confirmation=true` request and the order would be submitted.
    - Lab: Authentication bypass via flawed state machine
      - If you dropped the `/role-selector` request, the your role would default to admin.
4. Domain-specific flaws

5. Providing an encryption oracle

## Other important notes:
- These vulnerabilities mainly arise from using the the app in ways that a developer would not intend.
  - For example editing the request through a proxy.
