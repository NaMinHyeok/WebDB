var http=require('http');
var fs=require('fs');
var urlm=require('url');

var app = http.createServer(function(request, response) {
    var url = request.url;
    var queryData = urlm.parse(url, true).query;
    console.log(urlm.parse(url,true));      // URL 정보
    var pathname = urlm.parse(url,true).pathname    //  URL 정보 중 pathname 저장

    if(pathname == '/'){     // root로 접속 했을 때
        if(queryData.id === undefined){
            fs.readdir('./data',function(error,filelist){
                var title = 'Welcome'
                var description = 'Hello, Node.js'
                var list = '<ul>'
                var i =0;
                while(i < filelist.length) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i + 1;
                }
                list = list +'</ul>';
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
                        ${list}
                        <h2>${title}</h2>
                        <p>${description}</p>
                    </body>
                </html>`;
                response.writeHead(200);
                response.end(template);
        });
    }
        else {
            fs.readdir('./data',function(err,filelist){
                var list = '<ul>'
                var i =0;
                while(i < filelist.length) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i + 1;
                }
                list = list +'</ul>';
                fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
                    var title = queryData.id
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
                            ${list}
                            <h2>${title}</h2>
                            <p>${description}</p>
                        </body>
                    </html>`;
                    response.writeHead(200);
                    response.end(template);
                })
            })
        }
    }
    else {
        response.writeHead(404);
        response.end('NOT FOUND');
    }
});
app.listen(3000);