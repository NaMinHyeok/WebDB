var http=require('http');
var fs=require('fs');
var urlm=require('url');

var app = http.createServer(function(request, response) {
    var url = request.url;
    var queryData = urlm.parse(url, true).query;
    // console.log(queryData.id);
    var title = queryData.id;
    fs.readFile(`${queryData.id}`,'utf-8',function(err,description){

        var template = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>
                    WEB 1 - ${title}
                </title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB<a></h1>
                <ol>
                    <li><a href="/?id=13-HTML">HTML</a></li>
                    <li><a href="/?id=13-CSS">CSS</a></li>
                    <li><a href="/?id=13-JavaScript">JavaScript</a></li>
                </ol>
                <h2>${title}</h2>
                <p>${description}</p>
            </body>
        </html>`;
        response.writeHead(200);
        response.end(template);
    });
});
app.listen(3000);