var http=require('http');
var fs=require('fs');
var urlm=require('url');
var qs=require('querystring');
var template = require('./month_lib/month_template.js');
var db = require('./month_lib/db.js');
var mysql = require('mysql');
const calender = require('./month_lib/calender.js');

var db = mysql.createConnection({
    host:'localhost',
    user:'nodejs',
    password:'nodejs',
    database:'webdb2022'
});

db.connect();

var app = http.createServer(function(request, response) {
    var url = request.url;
    var queryData = urlm.parse(url, true).query;
    var pathname = urlm.parse(url,true).pathname;    //  URL 정보 중 pathname 저장

    if(pathname === '/'){     // root로 접속 했을 때
        if(queryData.id === undefined){
            calender.home(response);
    }
        else {
            calender.page(request,response);
        }
    }
    else if(pathname === '/create'){
        calender.create(request,response);
    }
    else if(pathname === '/create_process'){
        calender.create_process(request,response);
    }
    else if(pathname === '/update'){
        calender.update(request,response);
    }
    else if(pathname === '/update_process') {
        calender.update_process(request,response);
    }
    else if(pathname === '/delete_process') {
        calender.delete_process(request,response);
    }
    else {
        response.writeHead(404);
        response.end('NOT FOUND');
    }
});
app.listen(3000);