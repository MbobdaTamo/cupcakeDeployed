/*import httpProxy from 'http-proxy'
import http from 'http'

var proxy = httpProxy.createProxy();

var options = {
    'sassayer.com': 'https://sassayer.com:3000',
    'renting.sassayer.com': 'http://renting.sassayer.com:3001'
}

http.createServer(function(req, res) {
proxy.web(req, res, {
target: options[req.headers.host]
});
}).listen(80);

import https from "https"
import tls from "tls"
import constants from "constants"
import fs from "fs"
*/

import fs from 'fs'
import tls from 'tls'
import http from 'http'
import https from 'https'
import httpProxy from 'http-proxy'

const http_port = 80;
const https_port = 443;
const allow_http = true;
const allow_https = true;

//Default SSL (required, just put any valid cert)
const https_key =  "/etc/letsencrypt/live/sassayer.com/privkey.pem";
const https_cert = "/etc/letsencrypt/live/sassayer.com/cert.pem";
const https_ca = "/etc/letsencrypt/live/sassayer.com/chain.pem";

//Servers
const servers = {
	"sassayer.com": {
		target_http: "127.0.0.1:3001",
		target_https: "127.0.0.1:3000",
		key: "/etc/letsencrypt/live/sassayer.com/privkey.pem",
		cert: "/etc/letsencrypt/live/sassayer.com/cert.pem",
		ca: "/etc/letsencrypt/live/sassayer.com/chain.pem"
	},
	"renting.sassayer.com": {
		target_http: "127.0.0.1:3003",
		target_https: "127.0.0.1:3002",
		key: "/etc/letsencrypt/live/renting.sassayer.com/privkey.pem",
		cert: "/etc/letsencrypt/live/renting.sassayer.com/cert.pem",
		ca: "/etc/letsencrypt/live/renting.sassayer.com/chain.pem"
	},
	"cupcake.sassayer.com": {
		target_http: "127.0.0.1:3005",
		target_https: "127.0.0.1:3004",
		key: "/etc/letsencrypt/live/cupcake.sassayer.com/privkey.pem",
		cert: "/etc/letsencrypt/live/cupcake.sassayer.com/cert.pem",
		ca: "/etc/letsencrypt/live/cupcake.sassayer.com/chain.pem"
	},
	
}

//Read SSL
for (var host in servers) {
	var server = servers[host];
	if(server.cert)
	{
		server.ssl = {
			key: fs.readFileSync(server.key),
			ca: fs.readFileSync(server.ca),
			cert: fs.readFileSync(server.cert),
		}
		server.context = tls.createSecureContext(server.ssl);
	}
}

//Proxy Server
var proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
  res.writeHead(500);
  console.log(err);
  res.end('Proxy Error.');

});

var GetSslContext = function(host, cb)
{
	var server = servers[host];
	if (server && server.context) {
		cb(null, server.context);
	}
        else
        {
                cb("Invalid SSL");
        }
}

var ProxyLogic = function(req, res) {
	
	var host = req.headers.host;
	var server = servers[host];
	if(server)
	{
	     var secure = req.connection.encrypted;
	     var proto = secure ? 'https://' : 'http://';
	     var target = proto + (secure ? server.target_https : server.target_http);
	     var options = { target: target };
	     proxy.web(req, res, options);
	}
        else
	{
             res.writeHead(502);
             res.write('Invalid URL');
	     res.end();
	}
};

//HTTP
if(allow_http){
	
    var httpServer = http.createServer(ProxyLogic);
    httpServer.listen(http_port, function () {
        console.log('http listening port %s', http_port);
    });
}

//HTTPS
if(allow_https) {
	
    var options  = { 
		key: fs.readFileSync(https_key),
		cert: fs.readFileSync(https_cert),
		ca: fs.readFileSync(https_ca),
		SNICallback: GetSslContext 
    };

    var httpsServer = https.createServer(options, ProxyLogic);
    httpsServer.listen(https_port, function () {
        console.log('https listening port %s', https_port);
    });
}
