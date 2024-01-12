# Web Cache Poisoning

## How to identify:

- Scan response to see if anything from the request is reflected
  - For example a script import could be reflected from the host header
- See if changing the cookie, such as language impacts the response
  - For example there may be a cookie that could change a url
- See if the `X-Forwarded-Scheme` or `X-Forwarded-Proto` header leads to a 302
- Check for `Cache-Control: public, max-age=1800`, the max age allows you to know when to send the attack
- Check for the `vary` header, this could indicate why it works for you and not the victim
- You can use a port in the host header, try adding one and see what happens
- Use param miner to guess headers and get parameters
- Try using this header `Pragma: x-get-cache-key ` to see cache key in response
- Try sending a nonexistent path, see if path is reflected

## Evasion:

- One way to get around excluded parameters is [cloaking](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/All%20Lab%20Solutions.md#lab-parameter-cloaking)
- Another is a [fat GET](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/All%20Lab%20Solutions.md#lab-web-cache-poisoning-via-a-fat-get-request)

Notes:
- Many of the labs use the `Origin` header as a cache buster
- Remeber to look for the `X-Cache` header
