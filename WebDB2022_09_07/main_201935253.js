var http = require('http');
var fs = require('fs');
var urlm = require('url');
var app = http.createServer(function(request,response) {
    var url = request.url;
    var queryData = urlm.parse(url, true).query
    console.log(queryData)
    console.log(queryData.id)
    console.log(url)
    if(url =='/') {
        //url = '/test.html';
    }
    if(url == '/favicon.ico'){
        return response.writeHead(404);
    }
    if(queryData.id == 'HTML'){
        return response.writeHead(200).end(queryData.id + 'is Hyper Text Markup Language.');
    }
    if(queryData.id == 'CSS'){
        return response.writeHead(200).end(queryData.id + ' use web design.');
    }
    response.writeHead(200);
});
app.listen(3000);