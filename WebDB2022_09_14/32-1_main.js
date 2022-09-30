var http=require('http');
var fs=require('fs');
var urlm=require('url');
var qs=require('querystring');

function templateHTML(title, list, body){
    return `
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
            <a href="/create">create</a>
            ${body}
        </body>
    </html>
    `;
}
function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i += + 1;
    }
    list +='</ul>';
    return list;
}

var app = http.createServer(function(request, response) {
    var url = request.url;
    var queryData = urlm.parse(url, true).query;
    console.log(urlm.parse(url,true));      // URL 정보
    var pathname = urlm.parse(url,true).pathname    //  URL 정보 중 pathname 저장

    if(pathname === '/'){     // root로 접속 했을 때
        if(queryData.id === undefined){
            fs.readdir('../data',function(error,filelist){
                var title = 'Welcome'
                var description = 'Hello, Node.js'
                var list = templateList(filelist);
                var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);
                response.writeHead(200);
                response.end(template);
        });
    }
        else {
            fs.readdir('../data',function(err,filelist){
                var list = templateList(filelist)
                fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
                    var title = queryData.id
                    var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);
                    response.writeHead(200);
                    response.end(template);
                })
            })
        }
    }
    else if(pathname === '/create'){
        fs.readdir('../data',function(err,filelist){
                var title = 'WEB - create';
                var list = templateList(filelist);
                var template = templateHTML(title, list,`
                <form action = "http://localhost:3000/create_process" method="post">
                    <p><input type="text" name = "title" placeholder = "title"></p>
                    <p>
                        <textarea name = "description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type = "submit">
                    </p>
                </form>
            `);
            response.writeHead(200);
            response.end(template)
        });
        
    }
    else if(pathname === '/create_process'){
        var body ='';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            console.log(title);
            console.log(description);
        });
        response.writeHead(200);
        response.end('success');
    }
    else {
        response.writeHead(404);
        response.end('NOT FOUND');
    }
});
app.listen(3000);