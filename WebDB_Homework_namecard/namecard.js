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
                NameCard - ${title}
            </title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">NameCard-홈페이지<a></h1>
            <hr></hr>
            ${list}
            ${control}
            ${body}
        </body>
    </html>
    `;
}
function templateList(filelist){
    var list = '<ol>';
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
            fs.readdir('./namecard',function(error,filelist){
                var title = 'NameCard'
                var description = '나의 NameCard을 작성해보자'
                var list = templateList(filelist);
                var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`,
                `<button type="button" onclick="location.href='/create';">생성</button>`);
                response.writeHead(200);
                response.end(template);
        });
    }
        else {
            fs.readdir('./namecard',function(err,filelist){
                fs.readFile(`namecard/${queryData.id}`,'utf-8',function(err,description){
                    var title = queryData.id
                    var list = templateList(filelist)
                    var template = templateHTML(title,list,`<h2>${title}</h2><p>${description}</p>`,
                        `
                        <table>
                            <tr><button type="button" onclick="location.href='/create';">생성</button></tr>
                            <tr><button type="button" onclick="location.href='/update?id=${title}';">수정</button></tr>
                            <tr>
                            <form action="delete_process" method="post">
                                <input type = "hidden" name="id" value="${title}">
                                <button type = "submit" onclick="alert('정말로 삭제하시겠습니까?')">삭제</button>
                            </form>
                            </tr>
                        </table>
                        `
                    );
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }
    else if(pathname === '/create'){
        fs.readdir('./namecard',function(err,filelist){
                var title = '월별계획';
                var list = templateList(filelist);
                var template = templateHTML(title, list,`
                <form action = "http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" placeholder="이름"></p>
                    <p>
                        <textarea name = "description" placeholder="내용"></textarea>
                    </p>
                    <p>
                        <input type = "submit" value="생성">
                    </p>
                </form>
            `,
            `<button type="button" onclick="location.href='/';">홈페이지로가기</button>`
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
            fs.writeFile(`namecard/${title}`, description, 'utf8', function(err) {
                response.writeHead(302, {Location: encodeURI(`/?id=${title}`)});
                response.end();
            });
        });
    }
    else if(pathname === '/update'){
        fs.readdir('./namecard',function(error,filelist){
            fs.readFile(`namecard/${queryData.id}`, 'utf8',function(err, description) {
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
                    `<button type="button" onclick="location.href='/create';">생성</button>
                    <button type="button" onclick="location.href='/update?id=${title}';">수정</button>`);
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
            fs.rename(`namecard/${id}`,`namecard/${title}`,function(error){
                fs.writeFile(`namecard/${title}`, description, 'utf8', function(err){
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
            fs.unlink(`namecard/${id}`, function(error){
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