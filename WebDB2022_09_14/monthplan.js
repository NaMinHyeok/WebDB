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
                월별계획 - ${title}
            </title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">월별 계획<a></h1>
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
    var pathname = urlm.parse(url,true).pathname;    //  URL 정보 중 pathname 저장

    if(pathname === '/'){     // root로 접속 했을 때
        if(queryData.id === undefined){
            fs.readdir('./month',function(error,filelist){
                var title = '월별 계획'
                var description = '나의 월별 계획을 알아보자'
                var list = templateList(filelist);
                var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`,
                `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template);
        });
    }
        else {
            fs.readdir('./month',function(err,filelist){
                fs.readFile(`month/${queryData.id}`,'utf-8',function(err,description){
                    var title = queryData.id
                    var list = templateList(filelist)
                    var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>
                        <form action="delete_process" method="post">
                            <input type = "hidden" name="id" value="${title}">
                            <input type = "submit" value="delete">
                        </form>`
                    );
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }
    else if(pathname === '/create'){
        fs.readdir('./month',function(err,filelist){
                var title = '월별계획';
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
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
            response.writeHead(200);
            response.end(template);
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
            fs.writeFile(`month/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
                response.end();
            });
        });
    }
    else if(pathname === '/update'){
        fs.readdir('./month',function(error,filelist){
            fs.readFile(`month/${queryData.id}`, 'utf8',function(err, description) {
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
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                    response.writeHead(200);
                    response.end(template);
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
            fs.rename(`month/${id}`,`month/${title}`,function(error){
                fs.writeFile(`month/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
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
            fs.unlink(`month/${id}`, function(error){
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