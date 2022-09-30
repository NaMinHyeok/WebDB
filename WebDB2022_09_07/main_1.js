var http = require('http');
var fs = require('fs');
var urlm = require('url');
var app = http.createServer(function(request,response) {
    var url = request.url;
    var queryData = urlm.parse(url, true).query         // url 에서 querystring 문자열만 추출
    console.log(queryData)
    console.log(queryData.id)
    console.log(url)
    if(url =='/') {
        url = '/test.html';
    }
    if(url == '/favicon.ico'){
        return response.writeHead(404);
    }
    response.writeHead(200);

    var template = `
    <!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>
            WEB1 = ${queryData.id}
        </title>
    </head>
    <body>
        <h1><a href=/test.html>WEB<a></h1>
        <ol>
            <li><a href="/?id=HTML">HTML<a></li>
            <li><a href="/?id=CSS">CSS<a></li>
            <li><a href="/?id=JavaScript">JavaScript<a></li>
        </ol>
        <p>안녕하세요</p>
        <p>현재 queryData.id는 ${queryData.id}입니다.</p>
    </body>
</html>
    `;
    response.end(template);
});
app.listen(3000);

// id 값에 따라 다른 내용이 출력되도록 프로그램을 수정해보세요