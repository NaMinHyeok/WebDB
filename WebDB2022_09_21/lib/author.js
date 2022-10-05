var db = require('./db');
var template = require('./template.js');
var qs=require('querystring');
var url=require('url');

module.exports =  {
    home : function(response){
        db.query(`SELECT * FROM topic`, function(error, topics){
            db.query(`SELECT * FROM author` ,function(error2,authors){
                var title = 'author'
                var description = 'Hello, Node.js'
                var list = template.list(topics);
                var html = template.HTML(title,list,
                    `<table>
                        <tr><td></td></tr>
                    </table>
                    <style>
                        table { border-collapse: collapse;}
                        td { border: 1px solid black;}
                    </style>
                    `,``
                    );
                response.writeHead(200);
                response.end(html);
            });
        });
    },

    create_process : function(request,response){
        var body ='';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            db.query(`
                INSERT INTO topic (title, description, created, author_id)
                    VALUES(?,?,NOW(),?)`,
                [post.title, post.description, post.author], function(error,result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {Location: `/?id=${result.insertId}`});
                    response.end();
                }
            );
        });
    },
    update : function(request,response){
        var _url = request.url;
        var queryData = url.parse(_url, true).query;
        db.query('SELECT * FROM topic', function(error, topics){
            if(error){
                throw error;
            }
            db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
                if(error2){
                    throw error2;
                }
                db.query('SELECT * FROM author', function(error2,authors){
                    var list=template.list(topics);
                    var html=template.HTML(topic[0].title,list,
                        `       <form action="/update_process" method="post">
                                <input type="hidden" name="id" value="${topic[0].id}">
                                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                                <p><textarea name="description" placeholder="description">${topic[0].description}</textarea></p>
                                <p>${template.authorSelect(authors, topic[0].author_id)}</p>
                                <p> <input type="submit"> </p>
                            </form> `,
                            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                            );
                    response.writeHead(200);
                    response.end(html);
                })
                
            });
        });
    },
    update_process : function(request,response){
        var _url = request.url;
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
                [post.title, post.description, post.author, post.id], function(error, result){
                response.writeHead(302, {Location: `/?id=${post.id}`});
                response.end();
            });
        });
    },
    delete_process : function(request,response){
        var _url = request.url;
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            db.query('DELETE FROM topic WHERE id = ?',[post.id],function(error, result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: '/'});
                response.end();
            });
        });
    }
}
