var http=require('http');
var fs = require('fs');
var urlm=require('url');

var app = http.createServer(function(request,response){
    var url = request.url
    var queryData = urlm.parse(url, true).query;
    console.log(urlm.parse(url,true));
    var pathname = urlm.parse(url,true).pathname

    if(pathname == '/'){
        if(queryData.id === undefined){
            fs.readFile(`${queryData.id}`,'utf-8',function(err,description){
                var title = 'favicon.ico'
                var description = 'A favicon (short for favorite icon), also known as a shortcut icon, website icon, tab icon, URL icon.'
                var template = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>
                            favicon - ${title}
                        </title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <h1><a href="/">favicon이란<a></h1>
                        <ol>
                            <li><a href="/?id=HIS">1. History</a></li>
                            <li><a href="/?id=STAN">2. Standardization</a></li>
                            <li><a href="/?id=LEG">Legacy</a></li>
                        </ol>
                        <h2>${title}</h2>
                        <p>${description}</p>
                    </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            })
        }
        else {
            fs.readFile(`${queryData.id}`,'utf-8',function(err,description){
                var title = queryData.id
                var template = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <title>
                            favicon - ${title}
                        </title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <h1><a href="/">favicon이란<a></h1>
                        <ol>
                            <li><a href="/?id=HIS">1. History</a></li>
                            <li><a href="/?id=STAN">2. Standardization</a></li>
                            <li><a href="/?id=LEG">Legacy</a></li>
                        </ol>
                        <h2>${title}</h2>
                        <p>${description}</p>
                    </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            });
        }
    }
    else {
        response.writeHead(404);
        response.end('NOT FOUND')
    }
});
app.listen(3000);