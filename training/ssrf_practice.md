# Blind ssrf with out of band detection:
- It was in the referrer header
  - Just had to put the collaborator ip in the referrer header

# SSRF with blacklist-based input filter:
- Typically these block 127.0.0.1 and localhost
- Alternate representations of 127.0.0.1 are
  - 127.1
  - 213070643
  - 017700000001
- You can use a domain name that resolves to 127.0.0.1
  - For the labs use spoofed.burpcollaborator.net
- You can use url encoding or case variation
- Provide a url that you control that redirects to their url
- This is the stock api I used to exploit: `http%3A%2F%2F127.1%2FAdmin%2Fdelete?username=carlos`

# SSRF via open redirect:
- Found redirection in html page source
- Used this payload for stockapi: `/product/nextProduct?path=http://192.168.0.12:8080/admin/delete?username=carlos`
