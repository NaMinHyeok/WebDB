var http=require('http');
var fs=require('fs');
var urlm=require('url');
var qs=require('querystring');
var template = require('./template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request, response) {
    var url = request.url;
    var queryData = urlm.parse(url, true).query;
    var pathname = urlm.parse(url,true).pathname    //  URL 정보 중 pathname 저장

    if(pathname === '/'){     // root로 접속 했을 때
        if(queryData.id === undefined){
            fs.readdir('./data',function(error,filelist){
                var title = 'Welcome'
                var description = 'Hello, Node.js'
                var list = template.list(filelist);
                var html = template.HTML(title,list,`<h2>${title}</h2><p>${description}</p>`,
                `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
        });
    }
        else {
            var filteredId = path.parse(queryData.id).base;
            console.log(filteredId);
            fs.readdir('./data',function(err,filelist){
                fs.readFile(`data/${queryData.id}`,'utf-8',function(err,description){
                    var title = queryData.id
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDescription = sanitizeHtml(description, {
                        allowedTags:['h1']
                    });
                    var list = template.list(filelist)
                    var html = template.HTML(sanitizedTitle,list,`<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                        `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a>
                        <form action="delete_process" method="post">
                            <input type = "hidden" name="id" value="${sanitizedTitle}">
                            <input type = "submit" value="delete">
                        </form>`
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }
    else if(pathname === '/create'){
        fs.readdir('./data',function(err,filelist){
                var title = 'WEB - create';
                var list = template.list(filelist);
                var html = template.HTML(title, list,`
                <form action = "http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name = "description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type = "submit">
                    </p>
                </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
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
            fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
    }
    else if(pathname === '/update'){
        var filteredId = path.parse(queryData.id).base;
        console.log(filteredId);
        fs.readdir('./data',function(error,filelist){
            fs.readFile(`data/${queryData.id}`, 'utf8',function(err, description) {
                var title = queryData.id;
                var sanitizedTitle = sanitizeHtml(title);
                var sanitizedDescription = sanitizeHtml(description, {
                    allowedTags:['h1']
                });
                var list = template.list(filelist);
                var html = template.HTML(sanitizedTitle, list ,
                    `
                    <form action = "/update_process" method="post">
                        <input type = "hideen" name = "id" value = "${sanitizedTitle}">
                        <p><input type="text" name = "title" placeholder="title" value="${sanitizedTitle}"></p>
                        <p>
                            <textarea name = "description" placeholder = "description">${sanitizedDescription}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>`
                    ,
                    `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a>`);
                    response.writeHead(200);
                    response.end(html);
            });
        });
    }
    else if(pathname === '/update_process') {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`,`data/${title}`,function(error){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            })
        })
    }
    else if(pathname === '/delete_process') {
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(error){
                response.writeHead(302, {Location: '/'});
                response.end();
            });
        });
    }
    else {
        response.writeHead(404);
        response.end('NOT FOUND');
    }
});
app.listen(3000);