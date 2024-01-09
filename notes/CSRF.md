# CSRF

## Types:

1. Basic
2. Bypassing CSRF Token Validation
3. Bypassing SameSite Cookie restrictions
4. Bypassing Referer-based CSRF defenses

---

## How to find each type:

1. Basic
- Check all data that a user can change, for example the users email.

2. Bypassing CSRF Token Validation
- Try changing the method of the request, see if the token is still validated.
- Try removing the token.
- Try using the token for the other users request.
- Look for something like `csrfKey`
- Look for a cookie duplicating the token

3. Bypassing SameSite Cookie restrictions
- See if `SameSite=Strict` is set as a cookie, if not try the Lax bypass.
- Check parameters in others requests for redirects.
- If Oauth is being used try the cookie refresh attack

4. Bypassing Referer-based CSRF defenses
- Try removing the referer header
- See if the referer header just needs to include its own name: `http://attacker-website.com/csrf-attack?vulnerable-website.com`

---

## How to exploit each type:

1. Basic
- [CSRF Basic](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-basic)
2. Bypassing CSRF Token Validation
- [CSRF when validation depends on method](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-when-validation-depends-on-method)
- [CSRF when validation depends on parameter](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-when-validation-depends-on-parameter)
- [CSRF when token is not tied to user](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-when-token-is-not-tied-to-user)
- [CSRF when token is tied to non-session cookie](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-when-token-is-tied-to-non-session-cookie)
- [CSRF when token is duplicated in cookie](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-when-token-is-duplicated-in-cookie)
3. Bypassing SameSite Cookie restrictions
- [CSRF Samesite Lax bypass](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-samesite-lax-bypass)
- [CSRF SameSite strict via client open redirect](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-samesite-strict-via-client-open-redirect)
- [CSRF SameSite Strict via sibling domain](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-samesite-strict-via-sibling-domain)
- [CSRF bypass via cookie refresh](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-bypass-via-cookie-refresh)
4. Bypassing Referer-based CSRF defenses
- [CCSRF where referer header must be present](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-where-referer-header-must-be-present)
- [CSRF with bad referer validation](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/training/csrf_practice.md#csrf-with-bad-referer-validation)

---

## Other important notes:
- For an attack to be possible, three conditions must be met:
  - A relevant action. There is an action within the application that the attacker has a reason to induce. This might be a privileged action (such as modifying permissions for other users) or any action on user-specific data (such as changing the user's own password).
  - Cookie-based session handling. Performing the action involves issuing one or more HTTP requests, and the application relies solely on session cookies to identify the user who has made the requests. There is no other mechanism in place for tracking sessions or validating user requests.
  - No unpredictable request parameters. The requests that perform the action do not contain any parameters whose values the attacker cannot determine or guess. For example, when causing a user to change their password, the function is not vulnerable if an attacker needs to know the value of the existing password.
  - Burp Suite Pro has a built in PoC generator, this will generate a payload similar to the basic payload, which you then can edit.

