var http=require('http');
var fs=require('fs');
var urlm=require('url');
var qs=require('querystring');

function templateHTML(title, list, body, control){
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
            ${control}
            ${body}
        </body>
    </html>
    `;
}
function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list =  list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list+'</ul>';
    return list;
}

var app = http.createServer(function(request, response) {
    var url = request.url;
    var queryData = urlm.parse(url, true).query;
    var pathname = urlm.parse(url,true).pathname    //  URL 정보 중 pathname 저장

    if(pathname === '/'){     // root로 접속 했을 때
        if(queryData.id === undefined){
            fs.readdir('../data',function(error,filelist){
                var title = 'Welcome'
                var description = 'Hello, Node.js'
                var list = templateList(filelist);
                var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`,
                `<a href="/create>create</a>`);
                response.writeHead(200);
                response.end(template);
        });
    }
        else {
            fs.readdir('../data',function(err,filelist){
                fs.readFile(`../data/${queryData.id}`,'utf-8',function(err,description){
                    var title = queryData.id
                    var list = templateList(filelist)
                    var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create>create</a> <a href="/update?id=${title}">update</a>`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }
    else if(pathname === '/create'){
        fs.readdir('../data',function(err,filelist){
                var title = 'WEB - create';
                var list = templateList(filelist);
                var template = templateHTML(title, list,`
                <form action = "http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name = "description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type = "submit">
                    </p>
                </form>
            `);
            response.writeHead(200);
            response.end(template);
        });
    }
    else if(pathname === '/create_process'){
        var body ='';
        request.on('../data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`../data/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id={$title}`});
                response.end();
            });
        });
        response.writeHead(200);
        response.end('success');
    }
    else if(pathname === '/update'){
        fs.readdir('../data',function(error,fileist){
            fs.readFile(`data/${queryData.id}`, 'utf8',function(err, description) {
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list ,
                    `
                    <form action = "/update_process" method="post">
                        <input type = "hideen" name = "id" value = "${title}">
                        <p><input type="text" name = "title" placeholder="title" value="${title}"></p>
                        <p>
                            <textarea name = "description" placeholder = "description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>`
                    ,
                    `<a href="/create>create</a> <a href="/update?id=${title}">update</a>`);
                    response.writeHead(200);
                    response.end(template);
            });
        });
    }
    else {
        response.writeHead(404);
        response.end('NOT FOUND');
    }
});
app.listen(3000);