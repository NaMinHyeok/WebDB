var http = require('http');
var fs = require('fs')
var urlm = require('url');

function templateHTML(title,list,body){
    return  `
    <!DOCTYPE html>
    <html>  
        <head>
            <title>
                1년 연중 일정 - ${title}
            </title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">1년 연중 일정 및 계획<a></h1>
            ${list}
            ${body}
        </body>
    </html>
    `;
}

function templateList(filelist){
    var list = '<ul>'
    var i = 0;
    while( i< filelist.length){
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        i += 1;
    }
    list +='</ul>'
    return list;
}

var app = http.createServer(function(request,response){
    var url = request.url;
    var queryData = urlm.parse(url, true).query;
    console.log(urlm.parse(url,true));
    var pathname = urlm.parse(url, true).pathname;

    if(pathname == '/'){
        if(queryData.id === undefined){
            fs.readdir('./month',function(errror,filelist){
                var title = '월별 계획'
                var description = '월을 클릭해 주세요'
                var list = templateList(filelist)
                var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);
                response.writeHead(200);
                response.end(template);
            });
        }
        else {
            fs.readdir('./month', function(error, filelist){
                var list = templateList(filelist)
                fs.readFile(`month/${queryData.id}`,'utf-8',function(error,description){
                    var title = queryData.id
                    var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);
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