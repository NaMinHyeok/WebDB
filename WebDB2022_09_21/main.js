var http=require('http');
var url=require('url');
const { authorSelect } = require('./lib/template.js');
const topic = require('./lib/topic.js');
const author = require('./lib/author.js');

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url,true).pathname;    //  URL 정보 중 pathname 저장

    if(pathname === '/'){     // root로 접속 했을 때
        if(queryData.id === undefined){
            topic.home(response);
    }
        else {
            topic.page(request,response);
        }
    }
    else if(pathname === '/create') {
        topic.create(request,response);
    }
    else if(pathname === '/create_process'){
        topic.create_process(request,response);
    }
    else if(pathname === '/update'){
        topic.update(request,response);
    }
    else if(pathname === '/update_process') {
        topic.update_process(request,response);
    }
    else if(pathname === '/delete_process') {
        topic.delete_process(request,response);
    }
    else if(pathname === '/author'){
        author.home(request,response)
    }
    else if(pathname === '/author/create_process'){
        author.create_process(request,response)
    }
    else if(pathname === '/author/update'){
        author.update(request,response)
    }
    else if(pathname === '/author/update_process'){
        author.update_process(request,response)
    }
    else if(pathname === '/author/delete_process'){
        author.delete_process(request,response)
    }
    else {
        response.writeHead(404);
        response.end('NOT FOUND');
    }
});
app.listen(3000);