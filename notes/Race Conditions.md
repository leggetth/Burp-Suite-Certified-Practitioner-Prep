# Race Conditions

## Limit overrun race conditions
- Most well known
- You are exceeding the limit imposed by the server
- Burp repeater allows you to send 20-30 in sequence
- However, Turbo intruder might be more suited for the task to send larger numbers of requests
  - This is used to exploit the login mechanism in [Race condition auth bypass](https://github.com/leggetth/Burp-Suite-Certified-Practitioner-Prep/blob/main/All%20Lab%20Solutions.md#lab-bypassing-rate-limits-via-race-conditions)

## Hidden multi-step sequences
- Some websites use a multiple step sequence to verify things like mfa, however, this might be able to be bypassed by sending a request to another api while the mfa is waiting for input.
- To find these:
  - Look for possible collisions, like if two reset tokens could be the same
  - Probe for clues, use repeater with two requests in sequence
 
## Multi-endpoint
- In this attack, you are trying to use one endpoint to do an action while another is loading, for example, adding items to chart while checkout is finishing

## Single-endpoint
- This attempts to use an endpoint to result in data being miss sent, for example if to change a email a confirmation might be sent, however if you use a race condition the confirmation might be sent to the wrong email
- Another example portswigger gives is with reset tokens
- Portswigger notes that this requires a bit of luck

## Session-based
- Try sending requests at the same time to see if there is request locking

## Time sensitive
- The example given is a reset token that uses the current timestamp
