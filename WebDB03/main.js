var express = require('express');
var app = express();
app.set('views',__dirname+'/views');
app.set('view engine','ejs');
const template = require('./lib/template.js');
const db = require('./lib/db.js');
const topic = require('./lib/topic.js');
const author = require('./lib/author.js');
const { request, response } = require('express');

app.get('/',function(request,response){
    topic.home(request,response);
});

app.get('/page/:pageId',function(request,response){
    topic.page(request,response);
});
app.get('/create',function(request,response){
    topic.create(request,response);
});
app.post('/create_process',function(request,response){
    topic.create_process(request,response);
});
app.get('/update/:pageId',function(request,response){
    topic.update(request,response);
});
app.post('/update_process',function(request,response){
    topic.update_process(request,response);
});
app.post('/delete_process',function(request,response){
    topic.delete_process(request,response);
});
app.get('/author',function(request,response){
    author.home(request,response);
});
app.post('/author/create_process',function(request,response){
    author.create_process(request,response);
});
app.get('/author/update/:authorId',function(request,response){
    author.update(request,response);
});
app.post('/author/update_process',function(request,response){
    author.update_process(request,response);
});
app.post('/author/delete_process',function(request,response){
    author.delete_process(request,response);
});
app.listen(3000,() => 
    console.log('Example app listening on port 3000!'));